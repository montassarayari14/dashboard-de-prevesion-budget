const jwt = require("jsonwebtoken")

// Vérifie que le token JWT est valide
function verifyToken(req, res, next) {
  const header = req.headers["authorization"]
  if (!header) return res.status(401).json({ message: "Token manquant" })

  const token = header.split(" ")[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: "Token invalide ou expiré" })
  }
}

// Admin seulement
function adminOnly(req, res, next) {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" })
  }
  next()
}

// DG seulement
function dgOnly(req, res, next) {
  if (req.user?.role !== "DG") {
    return res.status(403).json({ message: "Accès réservé au Directeur Général" })
  }
  next()
}

// Admin OU DG
function adminOrDG(req, res, next) {
  if (req.user?.role !== "Admin" && req.user?.role !== "DG") {
    return res.status(403).json({ message: "Accès non autorisé" })
  }
  next()
}

module.exports = { verifyToken, adminOnly, dgOnly, adminOrDG }