const mongoose = require("mongoose")

// Stocke le token de réinitialisation de mot de passe
// TTL : MongoDB supprime automatiquement le document après 1 heure
const ResetTokenSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token:     { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // expire après 1h
})

module.exports = mongoose.model("ResetToken", ResetTokenSchema)