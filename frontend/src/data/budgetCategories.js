export const CATEGORIES_PAR_DIRECTION = {
  AI: [
    'AI001 → Fonctionnement audit',
    'AI501 → Projets audit'
  ],
  AJ: [
    'AJ001 → Fonctionnement juridique',
    'AJ501 → Projets juridiques'
  ],
  CG: [
    'CG001 → Fonctionnement contrôle',
    'CG501 → Projets analyse'
  ],
  DI: [
    'DI007 → Fonctionnement IT',
    'DI101 → Investissement IT',
    'DI500 → Projets IT'
  ],
  RH: [
    'RH001 → Affaires générales',
    'RH002 → Gestion RH',
    'RH008 → Fonds social',
    'RH012 → Pharmacie',
    'RH013 → Radiologie',
    'RH014 → Optique',
    'RH015 → Cliniques',
    'RH016 → Laboratoires',
    'RH017 → Centres spécialisés',
    'RH018 → Remboursements',
    'RH501 → Projets AG',
    'RH502 → Projets RH'
  ],
  SP: [
    'SP000 → Fonctionnement stratégique',
    'SP500 → Projets stratégiques'
  ]
};

// Fonction helper pour obtenir catégories d'une direction
export const getCategoriesForDirection = (directionCode) => {
  return CATEGORIES_PAR_DIRECTION[directionCode?.toUpperCase()] || [];
};

// Mapping label → code pour backend validation
export const CATEGORIES_MAP = {
  'AI001': 'Fonctionnement audit',
  'AI501': 'Projets audit',
  // ... (ajouter tous)
  // Note: Implémenter fully dans backend validate
};
