const mongoose = require("mongoose")

// Sous-document : un poste budgétaire soumis par le directeur
const PosteSchema = new mongoose.Schema({
  nom:       { type: String, required: true },
  categorie: { type: String, default: "Autre" },
  montant:   { type: Number, default: 0 },   // montant demandé année N
  montantN1: { type: Number, default: 0 },   // montant année N-1
}, { _id: false })

const DirectionSchema = new mongoose.Schema({
  code:      { type: String, required: true, unique: true },
  nom:       { type: String, required: true },
  directeur: { type: String, default: null },

  // Budget alloué par le DG
  budget:   { type: Number, default: 0 },
  budgetN1: { type: Number, default: 0 },  // budget de l'année précédente

  // Demande soumise par le directeur de direction
  postes:         { type: [PosteSchema], default: [] },
  totalDemande:   { type: Number, default: null },   // calculé à la soumission
  totalDemandeN1: { type: Number, default: null },   // historique N-1

  // Workflow
  statut: {
    type: String,
    enum: ["brouillon", "en_attente", "approuve", "rejete"],
    default: "brouillon"
  },
  soumisLe: { type: Date, default: null },

  // Décision du DG
  commentaireDG: { type: String, default: null },
  decisionLe:    { type: Date, default: null },
}, { timestamps: true })

module.exports = mongoose.model("Direction", DirectionSchema)