const express = require('express');
const { verifyToken, adminOrDG } = require('../middleware/auth');
const AIDecision = require('../models/AIDecision');
const Direction = require('../models/Direction');

const router = express.Router();

const CATEGORY_PRIORITY_WEIGHTS = {
  Haute: 25,
  Moyenne: 10,
  Faible: -15,
}
const PRIORITY_WEIGHTS = {
  faible: -5,
  moyenne: 10,
  élevée: 20,
  elevee: 20,
}
const CRITICITE_WEIGHTS = {
  faible: 0,
  moyen: 8,
  moyenne: 8,
  élevé: 15,
  eleve: 15,
}
const ROI_WEIGHTS = {
  faible: 0,
  moyen: 8,
  moyenne: 8,
  élevé: 15,
  eleve: 15,
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function detectCategoryPriority(category) {
  const text = normalizeText(category)

  if (/salaire|remuneration|personnel|paie|rh/.test(text)) return 'Haute'
  if (/medical|medecine|pharmacie|radiologie|optique|clinique|laboratoire/.test(text)) return 'Haute'
  if (/maintenance|it|informatique|cybersecurite|securite/.test(text)) return 'Haute'
  if (/obligation|legal|conformite|juridique/.test(text)) return 'Haute'

  if (/formation|outil|logiciel|projet|standard|projets/.test(text)) return 'Moyenne'

  if (/consulting|evenement|événement|non critique|non strategique|non strategique|hors mission/.test(text)) return 'Faible'

  return 'Moyenne'
}

function inferTypeFromCode(code) {
  const normalized = String(code || '').toLowerCase()
  if (/50[0-9]|500|501|502|503|504|505|506/.test(normalized)) return 'projets'
  if (/10[0-9]|investissement/.test(normalized)) return 'investissement'
  return 'fonctionnement'
}

function extractCategoryCode(categorie) {
  const match = String(categorie || '').toUpperCase().match(/\b[A-Z]{2}\d{3}\b/)
  return match ? match[0] : ''
}

function getCategoryOwner(categorie) {
  const categoryCode = extractCategoryCode(categorie)
  if (!categoryCode) return null

  for (const [directionCode, categories] of Object.entries(CATEGORIES_PAR_DIRECTION)) {
    if ((categories || []).some((category) => category.code === categoryCode)) {
      return directionCode
    }
  }

  return categoryCode.slice(0, 2)
}

function scoreDirectionFit(directionCode, categorie) {
  const code = String(directionCode || '').toUpperCase()
  const owner = getCategoryOwner(categorie)
  if (owner) return owner === code

  const category = normalizeText(categorie)
  const rules = [
    { dir: 'RH', pattern: /salair|social|medical|pharmacie|clinique|laboratoire/ },
    { dir: 'DI', pattern: /maintenance|it|informatique|logiciel|cybersecurite|projet/ },
    { dir: 'AJ', pattern: /juridique|conformite|obligation|legal|securite/ },
    { dir: 'CG', pattern: /controle|optimisation|audit|outil|projet/ },
    { dir: 'SP', pattern: /strategie|planification|vision|projet/ },
    { dir: 'AI', pattern: /audit|risque|controle|securite/ },
  ]

  const match = rules.find((rule) => code.startsWith(rule.dir) && rule.pattern.test(category))
  return Boolean(match)
}

function getDirectionAdaptation(directionCode, categorie) {
  if (scoreDirectionFit(directionCode, categorie)) return 10
  return -10
}

function getPriorityPoints(priority) {
  return PRIORITY_WEIGHTS[normalizeText(priority)] ?? 10
}

function getCriticitePoints(criticite) {
  return CRITICITE_WEIGHTS[normalizeText(criticite)] ?? 8
}

function getROIpoints(roi) {
  return ROI_WEIGHTS[normalizeText(roi)] ?? 8
}

function calculateMontantPoints(montant, budget) {
  if (!budget || budget <= 0) return 0
  const pct = (montant / budget) * 100
  if (pct > 75) return -35
  if (pct > 50) return -20
  if (pct <= 20) return 5
  return 0
}

function calculateBudgetPoints(budgetRestPct) {
  if (budgetRestPct < 0) return -35
  if (budgetRestPct < 10) return -30
  if (budgetRestPct < 20) return -15
  if (budgetRestPct <= 40) return 0
  return 10
}

function calculateFinalScore(baseScore, points) {
  const values = Object.values(points || {})
  const positiveTotal = values
    .filter((value) => value > 0)
    .reduce((sum, value) => sum + value, 0)
  const penaltyTotal = values
    .filter((value) => value < 0)
    .reduce((sum, value) => sum + value, 0)

  const scoreBeforePenalties = Math.min(100, baseScore + positiveTotal)
  return Math.round(Math.max(0, scoreBeforePenalties + penaltyTotal))
}

function formatMoney(value) {
  return `${Math.round(value || 0).toLocaleString('fr-FR')} DT`
}

function formatSignedPoints(value) {
  const rounded = Math.round(value || 0)
  return `${rounded > 0 ? '+' : ''}${rounded} pts`
}

function describeScoreBand(score) {
  if (score >= 85) return 'tres favorable'
  if (score >= 70) return 'favorable'
  if (score >= 55) return 'acceptable sous reserve'
  if (score >= 40) return 'fragile'
  return 'defavorable'
}

function buildAdvancedJustification({
  direction,
  demande,
  budget,
  budgetRestant,
  budgetRestantPct,
  taux,
  score,
  recommandation,
  niveauRisque,
  prioriteCategorie,
  primaryCategory,
  priorite,
  criticite,
  roi,
  coherence,
  points,
}) {
  const scoreDrivers = [
    ['categorie', points.category],
    ['priorite', points.priority],
    ['criticite', points.criticite],
    ['ROI', points.roi],
    ['montant', points.montant],
    ['budget restant', points.budget],
    ['alignement direction', points.adaptation],
  ].map(([label, value]) => `${label} ${formatSignedPoints(value)}`).join(', ')

  const budgetSignal = budgetRestant < 0
    ? `La demande depasse le budget de ${formatMoney(Math.abs(budgetRestant))}, ce qui impose un arbitrage ou une reduction de perimetre.`
    : budgetRestantPct < 20
      ? `La marge residuelle reste faible (${budgetRestantPct}% du budget), donc l'accord doit etre conditionne a un suivi strict des postes.`
      : `La marge residuelle reste exploitable (${budgetRestantPct}% du budget), ce qui limite le risque de tension immediate.`

  const coherenceSignal = coherence
    ? `La categorie "${primaryCategory}" est coherente avec la mission de la direction ${direction.code || direction.nom || ''}.`
    : `La categorie "${primaryCategory}" est peu alignee avec la mission de la direction ${direction.code || direction.nom || ''}; une validation metier complementaire est recommandee.`

  const decisionSignal = recommandation === 'APPROUVER'
    ? 'La recommandation est favorable car les gains metier et la cohérence budgétaire compensent les risques identifies.'
    : recommandation === 'ANALYSER'
      ? 'La recommandation reste prudente: la demande peut etre defendable, mais certains signaux doivent etre clarifies avant validation finale.'
      : 'La recommandation est negative car le niveau de risque et/ou la pression budgetaire rendent la demande difficile a justifier en l etat.'

  return [
    `Score ${score}/100 (${describeScoreBand(score)}) avec risque ${niveauRisque}.`,
    `Demande de ${formatMoney(demande)} sur un budget de ${formatMoney(budget)} (${taux}% consomme). ${budgetSignal}`,
    `${coherenceSignal} Les criteres retenus sont: categorie ${prioriteCategorie}, priorite ${priorite}, criticite ${criticite}, ROI ${roi}.`,
    `Contribution au score: ${scoreDrivers}. ${decisionSignal}`,
  ].join(' ')
}

// → GET /api/ai/history?limit=50
router.get('/history', verifyToken, adminOrDG, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const analyses = await AIDecision.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    // Enrichir avec les données de la direction
    const analysesWithDirection = await Promise.all(analyses.map(async (a) => {
      const direction = await Direction.findOne({ code: a.directionCode }).lean();
      return {
        ...a,
        directionId: direction?._id || a.directionId || null,
        budgetAlloue: direction?.budget || a.budgetAlloue,
        budgetDemande: direction?.totalDemande || a.budgetDemande,
        directionNom: direction?.nom || a.directionNom,
        nomDirection: direction?.nom || a.directionNom,
      };
    }));
    
    res.json({ success: true, data: analysesWithDirection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// → DELETE /api/ai/history/:id
router.delete('/history/:id', verifyToken, adminOrDG, async (req, res) => {
  try {
    await AIDecision.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Analyse supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────
// ━┓ ┏┓┏┓
// ┃ ┗┛
// ┛┗
// ─────────────────────────────────────────────────────────

// → POST /api/ai/analyze/:directionId
router.post('/analyze/:directionId', verifyToken, adminOrDG, async (req, res) => {
  try {
    const direction = await Direction.findById(req.params.directionId);
    if (!direction) {
      return res.status(404).json({ success: false, message: 'Direction non trouvée' });
    }

    // ═══════════════════════════════════════════════════════
    // ANALYSE HYBRIDE (RÈGLES MÉTIER + IA)
    // ═══════════════════════════════════════════════════════
    
    const budget = direction.budget || 0;
    const demande = direction.totalDemande || (direction.postes || []).reduce((sum, poste) => sum + (poste.montant || 0), 0);
    const budgetRestant = budget - demande;
    const budgetRestantPct = budget > 0 ? Math.round((budgetRestant / budget) * 100) : 0;
    const taux = budget > 0 ? Math.round((demande / budget) * 100) : 0;
    
    const categories = (direction.postes || []).map((poste) => poste.categorie || 'Autre');
    const categoryPriority = categories
      .map(detectCategoryPriority)
      .reduce((best, current) => {
        if (best === 'Haute' || (best === 'Moyenne' && current !== 'Haute')) return best;
        if (current === 'Haute') return 'Haute';
        if (current === 'Moyenne') return 'Moyenne';
        return current;
      }, 'Moyenne');

    const primaryCategory = categories.find((categorie) => detectCategoryPriority(categorie) === categoryPriority) || categories[0] || 'Autre';
    const type = direction.type || inferTypeFromCode(direction.code);
    const prioriteCategorie = categoryPriority;
    const priorite = direction.priorite || direction.priority || 'moyenne';
    const criticite = direction.criticite || direction.criticite || 'moyen';
    const roi = direction.ROI || direction.roi || direction.roiEstime || 'moyen';

    const categoryPoints = CATEGORY_PRIORITY_WEIGHTS[prioriteCategorie] || 10;
    const priorityPoints = getPriorityPoints(priorite);
    const criticitePoints = getCriticitePoints(criticite);
    const roiPoints = getROIpoints(roi);
    const montantPoints = calculateMontantPoints(demande, budget);
    const budgetPoints = calculateBudgetPoints(budgetRestantPct);
    const adaptationPoints = getDirectionAdaptation(direction.code, primaryCategory);
    const scoreBreakdown = {
      category: categoryPoints,
      priority: priorityPoints,
      criticite: criticitePoints,
      roi: roiPoints,
      montant: montantPoints,
      budget: budgetPoints,
      adaptation: adaptationPoints,
    };

    const score = calculateFinalScore(50, scoreBreakdown);

    const recommandation = score >= 70 ? 'APPROUVER' : score >= 40 ? 'ANALYSER' : 'REJETER';
    const decision = score >= 70 ? '✅ ACCEPTER' : score >= 40 ? '⚠️ À ANALYSER' : '❌ REJETER';
    const niveauRisque = score >= 70 ? 'FAIBLE' : score >= 40 ? 'MOYEN' : 'ELEVE';
    const coherence = scoreDirectionFit(direction.code, primaryCategory);

    const coherenceMetier = coherence
      ? `Catégorie cohérente avec la direction ${direction.code} et sa mission.`
      : `Catégorie peu alignée avec la direction ${direction.code} : vérifier la pertinence métier.`;

    const impactCategorie = prioriteCategorie === 'Haute'
      ? 'Impact stratégique élevé : catégorie prioritaire pour l’entreprise.'
      : prioriteCategorie === 'Moyenne'
        ? 'Impact métier moyen : la demande est importante mais modérée.'
        : 'Impact faible : catégorie non stratégique ou secondaire.';

    const analyseMontant = demande > 0
      ? `Montant demandé : ${demande.toLocaleString('fr-FR')} DT (${taux}% du budget). ${montantPoints < 0 ? 'Pénalité appliquée pour montant élevé.' : 'Montant acceptable par rapport au budget.'}`
      : 'Montant non renseigné, vérifier la demande.';

    const analyseBudget = budget > 0
      ? `Budget restant estimé à ${budgetRestantPct}% après cette demande. ${budgetPoints < 0 ? 'Risque de tension budgétaire.' : 'Marge disponible suffisante.'}`
      : 'Budget alloué non disponible, analyser avec prudence.';

    const facteurs = [];
    facteurs.push({
      detail: `Catégorie évaluée comme ${prioriteCategorie}.`,
      impact: prioriteCategorie === 'Faible' ? 'negatif' : 'positif',
    });
    facteurs.push({
      detail: `Priorité interne réglée sur ${priorite}.`,
      impact: priorityPoints >= 0 ? 'positif' : 'negatif',
    });
    facteurs.push({
      detail: `Criticité évaluée à ${criticite}.`,
      impact: criticitePoints >= 8 ? 'positif' : 'neutre',
    });
    if (budgetRestantPct < 20) {
      facteurs.push({
        detail: 'Budget restant limité après cette demande.',
        impact: 'negatif',
      });
    } else {
      facteurs.push({
        detail: 'Marge budgétaire raisonnable disponible.',
        impact: 'positif',
      });
    }

    facteurs.push({
      detail: `Contribution du montant demande: ${formatSignedPoints(montantPoints)} selon le taux de consommation (${taux}% du budget).`,
      impact: montantPoints < 0 ? 'negatif' : montantPoints > 0 ? 'positif' : 'neutre',
    });
    facteurs.push({
      detail: `Alignement metier direction/categorie: ${formatSignedPoints(adaptationPoints)} (${coherence ? 'coherent' : 'a verifier'}).`,
      impact: adaptationPoints >= 0 ? 'positif' : 'negatif',
    });
    facteurs.push({
      detail: `Lecture combinee criticite/ROI: ${formatSignedPoints(criticitePoints + roiPoints)} pour estimer urgence et valeur attendue.`,
      impact: criticitePoints + roiPoints >= 16 ? 'positif' : 'neutre',
    });

    const suggestions = [];
    if (recommandation === 'APPROUVER') {
      suggestions.push('Conserver la demande et suivre l’utilisation du budget.');
      suggestions.push('Vérifier les postes principaux pour garantir l’efficacité de la dépense.');
    } else if (recommandation === 'ANALYSER') {
      suggestions.push('Revoir certains postes et prioriser les coûts les plus stratégiques.');
      suggestions.push('Confirmer le niveau de criticité et la valeur ajoutée avant décision finale.');
    } else {
      suggestions.push('Évaluer des alternatives moins coûteuses ou reporter la dépense.');
      suggestions.push('Renforcer la justification métier si la décision doit être reconsidérée.');
    }

    const alertes = [];
    if (budgetRestant < 0) {
      alertes.push(`Dépassement budget : ${Math.abs(budgetRestant).toLocaleString('fr-FR')} DT`);
    }
    if (!coherence) {
      alertes.push('Incohérence potentielle entre la direction et la catégorie demandée.');
    }
    if (prioriteCategorie === 'Faible') {
      alertes.push('Dépense non stratégique : priorité faible détectée.');
    }

    const postesAnalyse = [];
    if (direction.postes && direction.postes.length > 0) {
      for (const poste of direction.postes) {
        const posteTaux = budget > 0 ? (poste.montant / budget) * 100 : 0;
        const montantSignificatif = posteTaux > 30;
        const categorieCoherente = scoreDirectionFit(direction.code, poste.categorie);
        const commentaires = [];

        if (montantSignificatif) {
          commentaires.push(`Part significative du budget (${Math.round(posteTaux)}%)`);
        }
        if (!categorieCoherente) {
          commentaires.push(`Categorie peu alignee avec la direction ${direction.code}`);
        }

        postesAnalyse.push({
          nom: poste.nom || 'Poste sans nom',
          categorie: poste.categorie || 'Autre',
          montant: poste.montant || 0,
          anomalie: commentaires.length > 0,
          commentaire: commentaires.length > 0 ? commentaires.join(' ; ') : null,
        });
      }
    }

    const justification = buildAdvancedJustification({
      direction,
      demande,
      budget,
      budgetRestant,
      budgetRestantPct,
      taux,
      score,
      recommandation,
      niveauRisque,
      prioriteCategorie,
      primaryCategory,
      priorite,
      criticite,
      roi,
      coherence,
      points: scoreBreakdown,
    });
    const risque = niveauRisque;

    const analyseResult = {
      analyse: {
        direction: direction.code || direction.nom || 'AI',
        categorie: primaryCategory,
        type,
        prioriteCategorie,
        budgetRestant: `${budgetRestantPct}%`,
        niveauRisque,
      },
      raisonnement: {
        coherenceMetier,
        impactCategorie,
        analyseMontant,
        analyseBudget,
      },
      score,
      decision,
      recommandation,
      risque: niveauRisque,
      justification,
      recommandations: suggestions,
      facteurs,
      alertes,
      budgetAlloue: budget,
      budgetDemande: demande,
      tauxConsommation: taux,
      scoreBreakdown,
    };

    // ── Sauvegarde en base ──
    const analyse = new AIDecision({
      directionId: direction._id,
      directionCode: direction.code,
      directionNom: direction.nom,
      decision: recommandation,
      statut: 'termine',
      raison: justification,
      score: Math.round(score),
      risque: risque,
      recommandation: recommandation,
      justification: justification,
      facteurs: facteurs,
      suggestions: suggestions,
      budgetAlloue: budget,
      budgetDemande: demande,
      tauxConsommation: taux,
      createdBy: req.user?.id || 'system',
    });
    
    await analyse.save();
    
    // ── Mise à jour du score AI dans la direction ──
    await Direction.findByIdAndUpdate(direction._id, {
      aiScore: Math.round(score),
      aiAnalyse: justification,
    });
    
    res.json({
      success: true,
      data: {
        ...analyse.toObject(),
        postesAnalyse,
        analyseResult,
      },
    });
  } catch (err) {
    console.error('Erreur analyse:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────
// ━┓ ┏┓┏┓ ┏┓┏
// ┃ ┗┛┗┛ ┏┓
// ┛┗ ┛┗ ┛┗
// ─────────────────────────────────────────────────────────

// Import catégories
const CATEGORIES_PAR_DIRECTION = require('./CATEGORIES_PAR_DIRECTION');

// → POST /api/ai/validate-demande  (NOUVEAU - pour formulaires)
router.post('/validate-demande', verifyToken, async (req, res) => {
  try {
    const { direction, categorie, sousCategorie, montant, description } = req.body;

    if (!direction || !categorie) {
      return res.status(400).json({ 
        success: false, 
        message: 'Direction et catégorie obligatoires' 
      });
    }

    const dirCode = direction.toUpperCase();
    const catCode = categorie.toUpperCase().split(' → ')[0]; // Ex: "AI001 → ..." → "AI001"
    const desc = (description || '').toLowerCase();
    const mt = parseFloat(montant) || 0;

    // 1. Vérifier existence catégorie dans direction
    const categoriesDir = CATEGORIES_PAR_DIRECTION[dirCode] || [];
    const catValide = categoriesDir.some(cat => cat.code === catCode);

    let validation = 'Incohérent';
    let correspondanceMetier = '❌ Incohérent';
    let pertinence = '';
    let type = 'inconnu';
    let suggestion = '';
    let alerte = '';

    if (catValide) {
      const catInfo = categoriesDir.find(cat => cat.code === catCode);
      type = catInfo.type;
      validation = 'Cohérent';
      correspondanceMetier = `✅ Très cohérent avec ${dirCode}`;
      pertinence = `${type.charAt(0).toUpperCase() + type.slice(1)}`;

      // Feedback intelligent sur description
      if (desc.includes('medical') || desc.includes('pharmacie')) {
        correspondanceMetier += ' (dépense médicale logique pour RH)';
      } else if (desc.includes('logiciel') || desc.includes('it')) {
        correspondanceMetier += ' (logique pour DI)';
      }

      suggestion = 'Description claire. Prête pour soumission.';
    } else {
      // Suggestions alternatives
      const suggestionsCats = categoriesDir.slice(0, 3).map(cat => cat.code);
      suggestion = `Proposer une meilleure catégorie: ${suggestionsCats.join(', ')}`;
      alerte = '⚠️ Mauvaise catégorie - risque de rejet';
    }

    // Check montant cohérence (ex: pas trop gros sans projet)
    if (mt > 50000 && !catCode.includes('500') && !catCode.includes('501')) {
      validation = 'À vérifier';
      alerte = '💰 Montant élevé pour fonctionnement - justifier';
    }

    // Format réponse EXACT task
    const response = {
      validation,
      'Catégorie': {
        Type: type,
        Code: catCode
      },
      'Analyse rapide': {
        'Correspondance métier': correspondanceMetier,
        Pertinence: pertinence
      },
      Suggestion: suggestion,
      Alerte: alerte || null
    };

    res.json({
      success: true,
      data: response
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// → POST /api/ai/chat
router.post('/chat', verifyToken, adminOrDG, async (req, res) => {
  try {
    const { question, contextBudget } = req.body;
    const q = (question || '').toLowerCase();
    
    let reponse = '';
    
    // ═══════════════════════════════════════════════════════
    // CHAT RULE-BASED (pas de vrai LLM, réponses intelligentes)
    // ═══════════════════════════════════════════════════════
    
    // ── Stats globales ──
    const allAnalyses = await AIDecision.find().lean();
    const total = allAnalyses.length;
    const approuver = allAnalyses.filter(a => a.recommandation === 'APPROUVER').length;
    const rejeter = allAnalyses.filter(a => a.recommandation === 'REJETER').length;
    const risqueEleve = allAnalyses.filter(a => a.risque === 'ELEVE').length;
    
    const directions = await Direction.find().lean();
    const budgetTotal = directions.reduce((s, d) => s + (d.budget || 0), 0);
    const demandeTotal = directions.reduce((s, d) => s + (d.totalDemande || 0), 0);
    const tauxGlobal = budgetTotal > 0 ? Math.round((demandeTotal / budgetTotal) * 100) : 0;
    
    // ── Questions fréquentes ──
    if (q.includes('risque') || q.includes('danger') || q.includes('problem')) {
      const aRisque = allAnalyses.filter(a => a.risque === 'ELEVE');
      if (aRisque.length > 0) {
        reponse = `⚠️ *${aRisque.length} directions présentent un risque élevé:*\n\n`;
        for (const a of aRisque.slice(0, 5)) {
          const dir = directions.find(d => d.code === a.directionCode);
          reponse += `• **${a.directionCode}** - ${dir?.nom || 'Direction'}\n`;
          reponse += `  Budget: ${a.budgetDemande?.toLocaleString('fr-FR')} DT / ${a.budgetAlloue?.toLocaleString('fr-FR')} DT\n`;
          reponse += `  Justification: ${a.justification?.substring(0, 80)}...\n\n`;
        }
      } else {
        reponse = '✅ Aucune direction ne présente de risque élevé actuellement. La situation budgétaire est stable.';
      }
    }
    else if (q.includes('résume') || q.includes('summary') || q.includes('jour')) {
      reponse = `📊 *Résumé du jour:*\n\n`;
      reponse += `• Total analyses: ${total}\n`;
      reponse += `• Recommandations d'approbation: ${approuver}\n`;
      reponse += `• Recommandations de rejet: ${rejeter}\n`;
      reponse += `• Directions à risque: ${risqueEleve}\n`;
      reponse += `\n💰 *Budget global:*\n`;
      reponse += `• Alloué: ${budgetTotal.toLocaleString('fr-FR')} DT\n`;
      reponse += `• Demandé: ${demandeTotal.toLocaleString('fr-FR')} DT\n`;
      reponse += `• Taux: ${tauxGlobal}%`;
    }
    else if (q.includes('budget') && (q.includes('total') || q.includes('global'))) {
      reponse = `💰 *Budget global:*\n\n`;
      reponse += `• **Alloué:** ${budgetTotal.toLocaleString('fr-FR')} DT\n`;
      reponse += `• **Demandé:** ${demandeTotal.toLocaleString('fr-FR')} DT\n`;
      reponse += `• **Taux d'utilisation:** ${tauxGlobal}%\n`;
      if (demandeTotal > budgetTotal) {
        const ecart = demandeTotal - budgetTotal;
        reponse += `\n⚠️ *Écart:* ${ecart.toLocaleString('fr-FR')} DT (dépassement)`;
      } else {
        const marge = budgetTotal - demandeTotal;
        reponse += `\n✅ *Marge:* ${marge.toLocaleString('fr-FR')} DT`;
      }
    }
    else if (q.includes('rejet') && q.includes('recommendation')) {
      const aRejeter = allAnalyses.filter(a => a.recommandation === 'REJETER');
      if (aRejeter.length > 0) {
        reponse = `❌ *${aRejeter.length} recommandations de rejet:*\n\n`;
        for (const a of aRejeter.slice(0, 5)) {
          reponse += `• **${a.directionCode}** - Score: ${a.score}/100\n`;
          reponse += `  ${a.justification?.substring(0, 100)}...\n\n`;
        }
      } else {
        reponse = '✅ Aucune recommandation de rejet. Toutes les demandes sont acceptables.';
      }
    }
    else if (q.includes('appro') || q.includes('approuver')) {
      const aApprouver = allAnalyses.filter(a => a.recommandation === 'APPROUVER');
      reponse = `✅ *${aApprouver.length} recommandations d'approbation:*\n\n`;
      for (const a of aApprouver.slice(0, 5)) {
        reponse += `• **${a.directionCode}** - Score: ${a.score}/100\n`;
        reponse += `  ${a.justification?.substring(0, 100)}...\n\n`;
      }
    }
    else if (q.includes('score') || q.includes('moyen')) {
      const avgScore = total > 0 
        ? Math.round(allAnalyses.reduce((s, a) => s + a.score, 0) / total)
        : 0;
      reponse = `📈 *Score moyen global:* **${avgScore}/100**\n\n`;
      if (avgScore >= 70) {
        reponse += '✅ La situation globale est satisfaisante.';
      } else if (avgScore >= 50) {
        reponse += '⚠️ La situation globale est acceptable mais mérite attention.';
      } else {
        reponse += '❌ La situation globale nécessite des mesures correctives.';
      }
    }
    else if (q.includes('aide') || q.includes('aide') || q.includes('help')) {
      reponse = `🤖 *Bienvenue sur l'Assistant IA!*

Je peux vous aider avec:
• 📊 Résumé des analyses du jour
• ⚠️ Liste des directions à risque
• 💰 Budget total demandé
• ✅ Recommandations d'approbation
• ❌ Recommandations de rejet
• 📈 Score moyen global

Tapez votre question ci-dessous!`;
    }
    else {
      // Réponse par défaut contextuelle
      const ctx = contextBudget?.resume || '';
      reponse = `🤔 J'ai bien reçu votre question: *"${question}"*\n\n`;
      
      if (ctx) {
        reponse += `📊 *Contexte:* ${ctx}\n\n`;
      }
      
      reponse += `Pour approfondir,，您可以:\n`;
      reponse += `• Consulter le détail d'une analyse spécifique\n`;
      reponse += `• Demander un résumé global\n`;
      reponse += `• Voir la liste des directions à risque\n\n`;
      reponse += `💡 *Tip:* Posez des questions précises pour de meilleures réponses!`;
    }
    
    res.json({ success: true, reponse });
  } catch (err) {
    console.error('Erreur chat:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────
// ┏┓┏┓┏┓┏┓┏┓
// ┃┃┃┃┃┃┃┃
// ┛┗┛┗┛┗┛
// ─────────────────────────────────────────────────────────

// Endpoint original pour compatibilité
router.get('/analyse/:code', verifyToken, adminOrDG, async (req, res) => {
  const analyses = {
    AI: { risk: 'low', recommendation: 'Budget stable', ecart: 5, metrics: { budget: 80000 } },
    AJ: { risk: 'medium', recommendation: 'Augmenter RH', ecart: 12 },
    CG: { risk: 'high', recommendation: 'Réduire dépenses', ecart: 18 },
    DI: { risk: 'low', recommendation: 'Investir tech', ecart: 2 },
    RH: { risk: 'medium', recommendation: 'Formation', ecart: 8 },
    SP: { risk: 'low', recommendation: 'OK', ecart: 3 }
  };
  res.json(analyses[req.params.code] || { risk: 'low', recommendation: 'Analyse OK' });
});

module.exports = router;
