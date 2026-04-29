const router     = require("express").Router()
const User       = require("../models/User")
const Log        = require("../models/Log")
const ResetToken = require("../models/ResetToken")
const bcrypt     = require("bcryptjs")
const jwt        = require("jsonwebtoken")
const crypto     = require("crypto")
const { envoyerEmailReset } = require("../config/mailer")

// Nombre de tentatives avant blocage
const MAX_TENTATIVES = 5
// Durée du blocage en minutes
const DUREE_BLOCAGE_MIN = 15

// ─────────────────────────────────────────────
// POST /api/auth/login
// Verrouillage par compte (pas par IP)
// ─────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, motDePasse } = req.body
    if (!email || !motDePasse) {
      return res.status(400).json({ message: "Email et mot de passe requis" })
    }

    const user = await User.findOne({ email })

    // Email inconnu — message volontairement vague
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // Compte désactivé par l'Admin
    if (user.status === "inactif") {
      return res.status(403).json({
        message: "Compte désactivé. Contactez l'administrateur.",
        desactive: true,
      })
    }

    // ── Vérifier si le compte est actuellement bloqué ──
    if (user.estBloque()) {
      const minutesRestantes = Math.ceil(
        (user.bloqueJusqua - new Date()) / 60000
      )
      return res.status(423).json({
        message: `Compte bloqué suite à ${MAX_TENTATIVES} tentatives échouées. Réessayez dans ${minutesRestantes} minute(s) ou réinitialisez votre mot de passe.`,
        bloque: true,
        minutesRestantes,
      })
    }

    // ── Vérifier le mot de passe ──
    const valide = await bcrypt.compare(motDePasse, user.motDePasse)

    if (!valide) {
      // Incrémenter le compteur de tentatives
      user.tentativesEchouees += 1

      if (user.tentativesEchouees >= MAX_TENTATIVES) {
        // Bloquer le compte pour DUREE_BLOCAGE_MIN minutes
        user.bloqueJusqua = new Date(Date.now() + DUREE_BLOCAGE_MIN * 60 * 1000)

        await Log.create({
          type:   "Info",
          action: `Compte bloqué après ${MAX_TENTATIVES} tentatives échouées : ${user.email}`,
          user:   `${user.prenom} ${user.nom}`,
        })

        await user.save()

        return res.status(423).json({
          message: `Compte bloqué pour ${DUREE_BLOCAGE_MIN} minutes après ${MAX_TENTATIVES} tentatives échouées. Réinitialisez votre mot de passe si nécessaire.`,
          bloque: true,
          minutesRestantes: DUREE_BLOCAGE_MIN,
        })
      }

      await user.save()

      const restantes = MAX_TENTATIVES - user.tentativesEchouees
      return res.status(401).json({
        message: `Mot de passe incorrect. Il vous reste ${restantes} tentative(s) avant blocage.`,
        tentativesRestantes: restantes,
      })
    }

    // ── Connexion réussie — réinitialiser le compteur ──
    user.tentativesEchouees = 0
    user.bloqueJusqua       = null
    await user.save()

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    await Log.create({
      type:   "Info",
      action: "Connexion au système",
      user:   `${user.prenom} ${user.nom}`,
    })

    const redirectMap = {
      "Admin":              "/dashboard",
      "Directeur":          "/direction/dashboard",
      "DG":                 "/dg/dashboard",
      "Directeur Generale": "/dg/dashboard",
    }

    res.json({
      token,
      user: {
        id:        user._id,
        nom:       user.nom,
        prenom:    user.prenom,
        email:     user.email,
        role:      user.role,
        direction: user.direction,
      },
      redirect: redirectMap[user.role] || "/dashboard",
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// ─────────────────────────────────────────────
// POST /api/auth/mot-de-passe-oublie
// ─────────────────────────────────────────────
router.post("/mot-de-passe-oublie", async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: "Email requis" })

    const user = await User.findOne({ email })

    // Toujours retourner 200 — évite de confirmer si l'email existe
    if (!user) {
      return res.json({ message: "Si cet email est enregistré, un lien a été envoyé." })
    }

    await ResetToken.deleteMany({ userId: user._id })

    const tokenBrut  = crypto.randomBytes(32).toString("hex")
    const tokenHache = await bcrypt.hash(tokenBrut, 10)
    await ResetToken.create({ userId: user._id, token: tokenHache })

    const lien = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${tokenBrut}&id=${user._id}`
    await envoyerEmailReset(user.email, lien)

    await Log.create({
      type:   "Info",
      action: `Demande de réinitialisation : ${user.email}`,
      user:   `${user.prenom} ${user.nom}`,
    })

    res.json({ message: "Si cet email est enregistré, un lien a été envoyé." })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email" })
  }
})

// ─────────────────────────────────────────────
// POST /api/auth/reinitialiser-mot-de-passe
// ─────────────────────────────────────────────
router.post("/reinitialiser-mot-de-passe", async (req, res) => {
  try {
    const { token, id, nouveauMotDePasse } = req.body

    if (!token || !id || !nouveauMotDePasse) {
      return res.status(400).json({ message: "Données manquantes" })
    }
    if (nouveauMotDePasse.length < 6) {
      return res.status(400).json({ message: "Minimum 6 caractères" })
    }

    const resetDoc = await ResetToken.findOne({ userId: id })
    if (!resetDoc) {
      return res.status(400).json({ message: "Lien invalide ou expiré" })
    }

    const valide = await bcrypt.compare(token, resetDoc.token)
    if (!valide) {
      return res.status(400).json({ message: "Lien invalide ou expiré" })
    }

    const hash = await bcrypt.hash(nouveauMotDePasse, 10)

    // ✅ Réinitialise aussi le blocage en même temps que le mot de passe
    await User.findByIdAndUpdate(id, {
      motDePasse:         hash,
      tentativesEchouees: 0,
      bloqueJusqua:       null,
    })

    await ResetToken.deleteMany({ userId: id })

    const user = await User.findById(id)
    await Log.create({
      type:   "Modification",
      action: "Mot de passe réinitialisé via email — blocage levé",
      user:   user ? `${user.prenom} ${user.nom}` : id,
    })

    res.json({ message: "Mot de passe modifié avec succès. Vous pouvez vous connecter." })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

module.exports = router