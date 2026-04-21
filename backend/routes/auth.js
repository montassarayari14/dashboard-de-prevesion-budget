const router = require("express").Router()
const User   = require("../models/User")
const Log    = require("../models/Log")
const bcrypt = require("bcryptjs")
const jwt    = require("jsonwebtoken")

router.post("/login", async (req, res) => {
  try {
    const { email, motDePasse } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" })

    if (user.status === "inactif") {
      return res.status(403).json({ message: "Compte désactivé" })
    }

    const valid = await bcrypt.compare(motDePasse, user.motDePasse)
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    await Log.create({
      type: "Info",
      action: "Connexion au système",
      user: `${user.prenom} ${user.nom}`
    })

    // ✅ Redirection selon le rôle — 3 espaces distincts
    const redirectMap = {
      "Admin":              "/dashboard",           // Axe 1
      "Directeur":          "/direction/dashboard", // Axe 2
      "DG":                 "/dg/dashboard",        // Axe 3
      "Directeur Generale": "/dg/dashboard",        // Axe 3 (alias)
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
      redirect: redirectMap[user.role] || "/dashboard"
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

module.exports = router