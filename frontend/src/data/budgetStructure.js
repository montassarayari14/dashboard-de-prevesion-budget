// Structure des catégories de budget par direction
// Chaque directeur ne voit que les catégories de sa propre direction

export const budgetStructure = {
  // 🚀 DIRECTION AUDIT INTERNE
  AI: [
    { code: "AI001", label: "Fonctionnement", type: "fonctionnement" },
    { code: "AI501", label: "Projets", type: "projets" }
  ],

  // ⚖️ DIRECTION AFFAIRES JURIDIQUES
  AJ: [
    { code: "AJ001", label: "Fonctionnement", type: "fonctionnement" },
    { code: "AJ501", label: "Projets", type: "projets" }
  ],

  // 📊 DIRECTION CONTRÔLE DE GESTION
  CG: [
    { code: "CG001", label: "Fonctionnement", type: "fonctionnement" },
    { code: "CG501", label: "Projets", type: "projets" }
  ],

  // 💻 DIRECTION INFORMATIQUE
  DI: [
    { code: "DI007", label: "Fonctionnement", type: "fonctionnement" },
    { code: "DI101", label: "Investissement", type: "investissement" },
    { code: "DI500", label: "Projets", type: "projets" }
  ],

  // 👥 DIRECTION RESSOURCES HUMAINES
  RH: [
    { code: "RH001", label: "Gestion RH", type: "gestion_rh" },
    { code: "RH002", label: "Gestion RH", type: "gestion_rh" },
    { code: "RH008", label: "Social", type: "social" },
    { code: "RH012", label: "Pharmacie", type: "medical" },
    { code: "RH013", label: "Radiologie", type: "medical" },
    { code: "RH014", label: "Optique", type: "medical" },
    { code: "RH015", label: "Cliniques", type: "medical" },
    { code: "RH016", label: "Laboratoires", type: "medical" },
    { code: "RH017", label: "Centres", type: "medical" },
    { code: "RH018", label: "Remboursement", type: "medical" },
    { code: "RH501", label: "Projets AG", type: "projets" },
    { code: "RH502", label: "Projets RH", type: "projets" }
  ],

  // 📈 DIRECTION STRATÉGIE & PLANIFICATION
  SP: [
    { code: "SP000", label: "Fonctionnement", type: "fonctionnement" },
    { code: "SP500", label: "Projets", type: "projets" }
  ]
}

// Fonction utilitaire pour récupérer les catégories d'une direction
export function getCategoriesForDirection(directionCode) {
  return budgetStructure[directionCode] || []
}
