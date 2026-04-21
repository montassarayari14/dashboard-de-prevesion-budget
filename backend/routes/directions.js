const router     = require("express").Router()
const Direction  = require("../models/Direction")
const Historique = require("../models/Historique")
const Log        = require("../models/Log")
const User       = require("../models/User")
const { verifyToken, adminOnly, dgOnly, adminOrDG } = require("../middleware/auth")

// ─────────────────────────────────────────────
// ROUTE DIRECTEUR — sa propre direction
// GET /api/directions/ma-direction
// ⚠️ DOIT être avant /:id
// ─────────────────────────────────────────────
router.get("/ma-direction", verifyToken, async (req, res) => {
  try {
    // On récupère le code de direction depuis le profil de l'utilisateur connecté
    const user = await User.findById(req.user.id)
    if (!user || !user.direction || user.direction === "-") {
      return res.status(404).json({ message: "Aucune direction assignée à ce compte" })
    }

    const direction = await Direction.findOne({ code: user.direction })
    if (!direction) {
      return res.status(404).json({ message: "Direction introuvable en base" })
    }

    res.json(direction)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// ─────────────────────────────────────────────
// ROUTE DIRECTEUR — modifier les postes (brouillon ou rejeté)
// PUT /api/directions/:id/postes
// ─────────────────────────────────────────────
router.put("/:id/postes", verifyToken, async (req, res) => {
  try {
    const { postes } = req.body
    const direction = await Direction.findById(req.params.id)

    if (!direction) return res.status(404).json({ message: "Direction introuvable" })

    // Seul un directeur peut modifier ses propres postes, en brouillon ou rejeté
    if (!["brouillon", "rejete"].includes(direction.statut)) {
      return res.status(400).json({ message: "Impossible de modifier une demande déjà soumise ou approuvée" })
    }

    direction.postes = postes || []
    await direction.save()

    await Log.create({
      type: "Modification",
      action: `Postes mis à jour — direction ${direction.code}`,
      user: req.user.id
    })

    res.json(direction)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// ─────────────────────────────────────────────
// ROUTE DIRECTEUR — soumettre à la DG
// PUT /api/directions/:id/soumettre
// ─────────────────────────────────────────────
router.put("/:id/soumettre", verifyToken, async (req, res) => {
  try {
    const { postes } = req.body

    if (!postes || postes.length === 0) {
      return res.status(400).json({ message: "Au moins un poste budgétaire est requis avant de soumettre" })
    }

    const direction = await Direction.findById(req.params.id)
    if (!direction) return res.status(404).json({ message: "Direction introuvable" })

    if (!["brouillon", "rejete"].includes(direction.statut)) {
      return res.status(400).json({ message: "Cette demande a déjà été soumise" })
    }

    const totalDemande = postes.reduce((sum, p) => sum + (p.montant || 0), 0)

    direction.postes       = postes
    direction.totalDemande = totalDemande
    direction.statut       = "en_attente"
    direction.soumisLe     = new Date()
    await direction.save()

    await Log.create({
      type: "Modification",
      action: `Demande soumise à la DG — direction ${direction.code} — ${totalDemande.toLocaleString("fr-FR")} DT`,
      user: req.user.id
    })

    res.json(direction)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// ─────────────────────────────────────────────
// GET /api/directions/historique
// ⚠️ DOIT être avant /:id
// ─────────────────────────────────────────────
router.get("/historique", verifyToken, async (req, res) => {
  try {
    const { code } = req.query

    // Si un code est passé en query (?code=DSI), filtre pour ce directeur
    const filtre = code ? { code } : {}
    const historique = await Historique.find(filtre).sort({ annee: -1 })
    res.json(historique)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// ─────────────────────────────────────────────
// GET /api/directions — liste toutes (Admin + DG)
// ─────────────────────────────────────────────
router.get("/", verifyToken, adminOrDG, async (req, res) => {
  try {
    const directions = await Direction.find().sort({ code: 1 })
    res.json(directions)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// ─────────────────────────────────────────────
// GET /api/directions/:id — détail (Admin + DG)
// ─────────────────────────────────────────────
router.get("/:id", verifyToken, adminOrDG, async (req, res) => {
  try {
    const direction = await Direction.findById(req.params.id)
    if (!direction) return res.status(404).json({ message: "Direction introuvable" })
    res.json(direction)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// ─────────────────────────────────────────────
// POST /api/directions — créer (Admin seulement)
// ─────────────────────────────────────────────
router.post("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const direction = await Direction.create(req.body)
    await Log.create({ type: "Création", action: `Direction ${direction.code} créée`, user: "Admin" })
    res.json(direction)
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Code déjà existant" })
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// ─────────────────────────────────────────────
// PUT /api/directions/:id — modifier (Admin seulement)
// ─────────────────────────────────────────────
router.put("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const direction = await Direction.findByIdAndUpdate(req.params.id, req.body, { new: true })
    await Log.create({ type: "Modification", action: `Direction ${direction.code} modifiée`, user: "Admin" })
    res.json(direction)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// ─────────────────────────────────────────────
// DELETE /api/directions/:id — supprimer (Admin seulement)
// ─────────────────────────────────────────────
router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const direction = await Direction.findByIdAndDelete(req.params.id)
    if (!direction) return res.status(404).json({ message: "Direction introuvable" })
    await Log.create({ type: "Suppression", action: `Direction ${direction.code} supprimée`, user: "Admin" })
    res.json({ message: "Supprimée" })
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// ─────────────────────────────────────────────
// PUT /api/directions/:id/decision — DG seulement
// ─────────────────────────────────────────────
router.put("/:id/decision", verifyToken, dgOnly, async (req, res) => {
  try {
    const { statut, commentaire } = req.body

    if (!["approuve", "rejete"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide : approuve ou rejete" })
    }

    const direction = await Direction.findById(req.params.id)
    if (!direction) return res.status(404).json({ message: "Direction introuvable" })

    if (direction.statut !== "en_attente") {
      return res.status(400).json({ message: "Seules les demandes en attente peuvent être traitées" })
    }

    direction.statut        = statut
    direction.commentaireDG = commentaire || null
    direction.decisionLe    = new Date()
    await direction.save()

    // Archiver dans l'historique
    const annee = new Date().getFullYear().toString()
    await Historique.findOneAndUpdate(
      { annee, code: direction.code },
      {
        annee, code: direction.code, nom: direction.nom, directeur: direction.directeur,
        budget: direction.budget, totalDemande: direction.totalDemande,
        statut: direction.statut, commentaireDG: direction.commentaireDG, decisionLe: direction.decisionLe,
      },
      { upsert: true }
    )

    await Log.create({
      type: "Modification",
      action: `Direction ${direction.code} ${statut === "approuve" ? "approuvée" : "rejetée"} par le DG`,
      user: "Directeur Général"
    })

    res.json(direction)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

module.exports = router