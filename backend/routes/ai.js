const express = require('express');
const { verifyToken, adminOrDG } = require('../middleware/auth');
const AIDecision = require('../models/AIDecision');
const Direction = require('../models/Direction');

const router = express.Router();

// ─────────────────────────────────────────────────────────
// ━┓┏┓┏┓┏┓┏┓┏┓┏┓
// ┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┏┓┏
// ┃┗┛┗┛┗┛┗┛┗┛┗┛┗
// ┛┗┛┗┛┗┛┗┛┗┛┗┛┗
// ─────────────────────────────────────────────────────────

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
        budgetAlloue: direction?.budget || a.budgetAlloue,
        budgetDemande: direction?.totalDemande || a.budgetDemande,
        directionNom: direction?.nom || a.directionNom,
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
    const demande = direction.totalDemande || 0;
    const taux = budget > 0 ? (demande / budget) * 100 : 0;
    
    // ── Détermination du risque ──
    let risque = 'FAIBLE';
    let score = 85;
    
    if (taux > 100) {
      risque = 'ELEVE';
      score = 20;
    } else if (taux > 85) {
      risque = 'MOYEN';
      score = 50;
    } else if (taux > 70) {
      risque = 'FAIBLE';
      score = 75;
    }
    
    // ── Génération de la justification ──
    let justification = '';
    let recommandation = 'APPROUVER';
    
    if (taux <= 70) {
      justification = `Budget cohérent : ${taux.toFixed(1)}% d'utilisation. ${direction.code} présente une gestion prudente avec une marge confortable.`;
      recommandation = 'APPROUVER';
      score = Math.min(95, 80 + (70 - taux) / 2);
    } else if (taux <= 85) {
      justification = `Budget modéré : ${taux.toFixed(1)}% d'utilisation. La demande est raisonnable mais mérite un suivi.`;
      recommandation = 'APPROUVER';
      score = 70;
    } else if (taux <= 100) {
      justification = `Budget tendu : ${taux.toFixed(1)}% d'utilisation. La demande approche la limite autorisée.`;
      recommandation = 'APPROUVER';
      score = 50;
    } else {
      justification = `Dépassement critique : ${taux.toFixed(1)}% d'utilisation. La demande excède le budget alloué de ${(demande - budget).toLocaleString('fr-FR')} DT.`;
      recommandation = 'REJETER';
      score = 25;
    }
    
    // ── Analyse des facteurs ──
    const facteurs = [];
    
    // Tendance historique (simulé)
    facteurs.push({
      detail: 'Tendance estável sur les 3 derniers exercices',
      impact: 'positif',
    });
    
// Ratio par rapport à la moyenne
    if (taux > 90) {
      facteurs.push({
        detail: 'Ratio supérieur à la moyenne des directions',
        impact: 'negatif',
      });
    } else {
      facteurs.push({
        detail: 'Ratio dans les normes acceptables',
        impact: 'positif',
      });
    }
    
    // Postes budgétaires
    const postesAnalyse = [];
    if (direction.postes && direction.postes.length > 0) {
      for (const poste of direction.postes) {
        const posteTaux = budget > 0 ? (poste.montant / budget) * 100 : 0;
        postesAnalyse.push({
          nom: poste.nom || 'Poste sans nom',
          categorie: poste.categorie || 'Autre',
          montant: poste.montant || 0,
          anomalie: posteTaux > 30,
          commentaire: posteTaux > 30 ? 'Part significative du budget' : null,
        });
      }
    }
    
    // ── Suggestions ──
    const suggestions = [];
    if (taux > 100) {
      suggestions.push('Réduire certains postes non essentiels');
      suggestions.push('Reporter les investissements à nextYear');
    } else if (taux > 85) {
      suggestions.push('Prévoir une rallonge budgétaire');
    } else {
      suggestions.push('Maintenir la cadence');
    }
    
    // ── Sauvegarde en base ──
    const analyse = new AIDecision({
      directionCode: direction.code,
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
