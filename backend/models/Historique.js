const mongoose = require("mongoose")

// Archivage des décisions DG par campagne et par direction
const HistoriqueSchema = new mongoose.Schema({
  annee:         { type: String, required: true },
  code:          { type: String, required: true },
  nom:           { type: String },
  directeur:     { type: String },
  budget:        { type: Number },
  totalDemande:  { type: Number },
  statut: {
    type: String,
    enum: ["brouillon", "en_attente", "approuve", "rejete"]
  },
  commentaireDG: { type: String, default: null },
  decisionLe:    { type: Date, default: null },
}, { timestamps: true })

module.exports = mongoose.model("Historique", HistoriqueSchema)