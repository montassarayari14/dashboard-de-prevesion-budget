const router = require("express").Router()
const User   = require("../models/User")
const Log    = require("../models/Log")
const bcrypt = require("bcryptjs")
const { verifyToken, adminOnly } = require("../middleware/auth")

// GET /api/users — tous les utilisateurs (Admin)
router.get("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-motDePasse")
    res.json(users)
  } catch { res.status(500).json({ message: "Erreur serveur" }) }
})

// POST /api/users — créer (Admin) — mot de passe par défaut 123456
router.post("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const { nom, prenom, email, role, direction } = req.body
    const hash = await bcrypt.hash("123456", 10)
    const user = await User.create({ nom, prenom, email, motDePasse: hash, role, direction })
    await Log.create({ type: "Création", action: `Compte créé : ${prenom} ${nom} (${role})`, user: "Admin" })
    const { motDePasse, ...safe } = user.toObject()
    res.json(safe)
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email déjà utilisé" })
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// PUT /api/users/:id/toggle — activer / désactiver (Admin)
router.put("/:id/toggle", verifyToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" })
    user.status = user.status === "actif" ? "inactif" : "actif"
    await user.save()
    await Log.create({ type: "Modification", action: `Statut modifié : ${user.prenom} ${user.nom}`, user: "Admin" })
    const { motDePasse, ...safe } = user.toObject()
    res.json(safe)
  } catch { res.status(500).json({ message: "Erreur serveur" }) }
})

// DELETE /api/users/:id — supprimer (Admin)
router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" })
    await Log.create({ type: "Suppression", action: `Compte supprimé : ${user.prenom} ${user.nom}`, user: "Admin" })
    res.json({ message: "Supprimé" })
  } catch { res.status(500).json({ message: "Erreur serveur" }) }
})

// PUT /api/users/:id/email — modifier son propre email (utilisateur connecté)
router.put("/:id/email", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Accès refusé" })
    }
    const { email } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { email }, { new: true }).select("-motDePasse")
    res.json(user)
  } catch { res.status(500).json({ message: "Erreur serveur" }) }
})

// PUT /api/users/:id/password — changer son propre mot de passe (utilisateur connecté)
router.put("/:id/password", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Accès refusé" })
    }
    const { ancienMotDePasse, nouveauMotDePasse } = req.body
    const user = await User.findById(req.params.id)
    const valid = await bcrypt.compare(ancienMotDePasse, user.motDePasse)
    if (!valid) return res.status(401).json({ message: "Ancien mot de passe incorrect" })
    user.motDePasse = await bcrypt.hash(nouveauMotDePasse, 10)
    await user.save()
    res.json({ message: "Mot de passe modifié" })
  } catch { res.status(500).json({ message: "Erreur serveur" }) }
})

module.exports = router