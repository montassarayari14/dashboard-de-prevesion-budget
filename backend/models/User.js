const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  nom:        { type: String, required: true },
  prenom:     { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Directeur", "Directeur Generale", "DG"],
    default: "Directeur"
  },
  direction: { type: String, default: "-" },
  status:    { type: String, enum: ["actif", "inactif"], default: "actif" },

  // ── Verrouillage par compte ──────────────────────────────
  // Nombre de tentatives échouées consécutives
  tentativesEchouees: { type: Number, default: 0 },
  // Date jusqu'à laquelle le compte est bloqué (null = pas bloqué)
  bloqueJusqua:       { type: Date, default: null },
  // ─────────────────────────────────────────────────────────

}, { timestamps: true })

// Méthode : le compte est-il actuellement bloqué ?
UserSchema.methods.estBloque = function () {
  if (!this.bloqueJusqua) return false
  return new Date() < this.bloqueJusqua
}

module.exports = mongoose.model("User", UserSchema)