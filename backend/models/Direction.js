const mongoose = require("mongoose")

// Sous-document : un poste budgétaire avec IA
const PosteSchema = new mongoose.Schema({
  nom:            { type: String, required: true },
  categorie:       { type: String, required: true },
  sousCategorie:   { type: String, default: "" },
  montant:         { type: Number, required: true },
  montantN1:       { type: Number, default: 0 },
  justification:   { type: String, required: true },
  aiValidation:    { type: mongoose.Schema.Types.Mixed, default: null }, // Feedback IA
}, { _id: false })

const DirectionSchema = new mongoose.Schema({
  code:      { type: String, required: true, unique: true },
  nom:       { type: String, required: true },
  directeur: { type: String, default: null },

  // Budgets
  budget:    { type: Number, default: 0 },
  budgetN1:  { type: Number, default: 0 },

  // Demandes
  postes:         { type: [PosteSchema], default: [] },
  totalDemande:   { type: Number, default: null },
  totalDemandeN1: { type: Number, default: null },

  // Workflow
  statut: {
    type: String,
    enum: ["brouillon", "en_attente", "approuve", "rejete"],
    default: "brouillon"
  },
  soumisLe: { type: Date, default: null },

  // DG
  commentaireDG: { type: String, default: null },
  decisionLe:    { type: Date, default: null },

  // IA
  aiScore:   { type: Number, default: null },
  aiAnalyse: { type: String, default: null },
  analyseLe: { type: Date, default: null }
}, { timestamps: true })

module.exports = mongoose.model("Direction", DirectionSchema)
