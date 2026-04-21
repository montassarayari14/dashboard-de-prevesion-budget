const router = require("express").Router()
const Log    = require("../models/Log")
const { verifyToken, adminOrDG } = require("../middleware/auth")

// GET /api/logs — accessible Admin + DG
router.get("/", verifyToken, adminOrDG, async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(200)
    res.json(logs)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

module.exports = router