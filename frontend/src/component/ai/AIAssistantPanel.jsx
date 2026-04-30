// Panneau principal de l'Assistant IA DG
// Design moderne glassmorphism avec visualisations détaillées

import { useState } from "react"
import API from "../../api/axios"
import AIRecommendationCard from "./AIRecommendationCard"
import BudgetAnalysisMetrics from "./BudgetAnalysisMetrics"
import RiskBadge from "./RiskBadge"

export default function AIAssistantPanel({ direction }) {
  const [analyse, setAnalyse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expanded, setExpanded] = useState(true)

  async function lancerAnalyse() {
    if (!direction?._id) return
    setLoading(true)
    setError("")
    try {
      const res = await API.post(`/ai/analyze/${direction._id}`)
      setAnalyse(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'analyse IA")
    } finally {
      setLoading(false)
    }
  }

  // Si la direction n'est pas en attente, on affiche juste un résumé
  if (direction?.statut !== "en_attente") {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">
              Assistant IA
            </p>
            <p className="text-slate-500 text-xs mt-1">
              {direction?.statut === "approuve"
                ? "Cette demande a déjà été approuvée."
                : direction?.statut === "rejete"
                ? "Cette demande a été rejetée."
                : "Aucune analyse disponible pour ce statut."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl mb-5 overflow-hidden shadow-2xl">
      {/* En-tête du panneau avec glassmorphism */}
      <div 
        className={`p-5 md:px-6 border-b border-white/5 ${expanded ? 'border-white/5' : ''} flex items-center justify-between cursor-pointer group transition-all duration-300 hover:bg-white/5`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/10 flex items-center justify-center border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <p className="text-white text-base font-bold tracking-wide">
              Assistant IA — Aide à la décision
            </p>
            <p className="text-slate-500 text-xs mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Analyse hybride (règles métier + IA)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {analyse && <RiskBadge niveau={analyse.risque} />}
          <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-6 space-y-6">
          {/* Bouton d'analyse avec design moderne */}
          {!analyse && !loading && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                Lancer une analyse complète de cette demande de budget avec l'intelligence artificielle
              </p>
              <button
                onClick={lancerAnalyse}
                className="relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm inline-flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105"
              >
                <span className="text-lg">⚡</span>
                <span>Analyser ce budget</span>
              </button>
            </div>
          )}

          {/* Loading avec animation moderne */}
          {loading && (
            <div className="text-center py-10">
              <div className="relative w-24 h-24 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                <div className="absolute inset-4 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2">
                L'IA analyse les données budgétaires...
              </p>
              <p className="text-slate-600 text-xs">
                Cette opération peut prendre quelques secondes
              </p>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">⚠️</span>
              {error}
            </div>
          )}

          {/* Résultats avec design détaillé */}
          {analyse && !loading && (
            <div className="space-y-6">
              {/* Section Métriques avec design glassmorphism */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs">📊</span>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Métriques analysées</p>
                </div>
                <BudgetAnalysisMetrics analyse={analyse} />
              </div>

              {/* Recommandation avec design détaillé */}
              <AIRecommendationCard analyse={analyse} />

              {/* Analyse des postes avec design moderne */}
              {analyse.postesAnalyse && analyse.postesAnalyse.length > 0 && (
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-xs">📋</span>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Analyse des postes</p>
                  </div>
                  <div className="space-y-2">
                    {analyse.postesAnalyse.map((p, i) => (
                      <div key={i} className={`p-4 rounded-xl flex justify-between items-center transition-all duration-200 hover:scale-[1.01] ${
                        p.anomalie 
                          ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30' 
                          : 'bg-slate-800/50 border border-white/5'
                      }`}>
                        <div className="flex-1">
                          <p className="text-white text-sm font-semibold flex items-center gap-2">
                            {p.nom}
                            {p.anomalie && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
                          </p>
                          <p className="text-slate-500 text-xs mt-1 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-xs">{p.categorie}</span>
                            <span className="text-slate-400">{p.montant.toLocaleString("fr-FR")} DT</span>
                            {p.anomalie && (
                              <span className="text-amber-400 flex items-center gap-1">
                                <span>⚠️</span> {p.commentaire}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          p.anomalie 
                            ? 'bg-amber-500/20' 
                            : 'bg-green-500/20'
                        }`}>
                          <span className="text-xl">{p.anomalie ? "🔴" : "🟢"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions avec design détaillé */}
              {analyse.suggestions && analyse.suggestions.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs">💡</span>
                    <p className="text-indigo-400 text-xs uppercase tracking-wider font-semibold">Suggestions de l'IA</p>
                  </div>
                  <ul className="space-y-2 pl-2">
                    {analyse.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-indigo-300 text-sm leading-relaxed p-3 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors">
                        <span className="w-5 h-5 rounded-md bg-indigo-500/20 flex items-center justify-center text-xs flex-shrink-0">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source avec design moderne */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <p className="text-slate-600 text-xs">
                  Source: {analyse.justificationLLM ? "Analyse hybride (règles + LLM)" : "Analyse rule-based"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs">Score:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    analyse.score >= 50 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {analyse.score}/100
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
