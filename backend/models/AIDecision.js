const mongoose = require('mongoose');

const aiDecisionSchema = new mongoose.Schema({
  directionCode: String,
  directionNom: String,
  decision: String,
  statut: { type: String, default: 'en_attente' },
  raison: String,
  createdBy: String,
  
  // Champs pour l'analyse IA
  score: { type: Number, default: 0 },
  risque: { 
    type: String, 
    enum: ['FAIBLE', 'MOYEN', 'ELEVE'],
    default: 'FAIBLE' 
  },
  recommandation: { 
    type: String, 
    enum: ['APPROUVER', 'REJETER', 'ANALYSER', 'EN_ATTENTE'],
    default: 'EN_ATTENTE' 
  },
  justification: String,
  
  // Facteurs d'analyse
  facteurs: [{
    detail: String,
    impact: { type: String, enum: ['positif', 'negatif', 'neutre'] }
  }],
  
  // Suggestions
  suggestions: [String],
  
  // Données budgétaires
  budgetAlloue: Number,
  budgetDemande: Number,
  tauxConsommation: Number,
  
}, { timestamps: true });

module.exports = mongoose.model('AIDecision', aiDecisionSchema);
