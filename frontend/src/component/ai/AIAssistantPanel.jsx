// Panneau principal Assistant IA DG – Theme-aware Tailwind
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
      setAnalyse({
        ...res.data.data.analyseResult,
        postesAnalyse: res.data.data.postesAnalyse || [],
      })
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'analyse IA")
    } finally {
      setLoading(false)
    }
  }

  if (direction?.statut !== "en_attente") {
    return (
      <div className="bg-bg-card/80 backdrop-blur-sm border border-bg-border/50 rounded-2xl p-5 mb-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-main/10 flex items-center justify-center border border-accent-main/30">
            <span className="text-xs uppercase tracking-[0.25em] text-accent-main font-medium">IA</span>
          </div>
          <div>
            <p className="text-text-primary text-sm font-semibold">
              Assistant IA
            </p>
            <p className="text-text-secondary text-xs mt-1">
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
    <div className="bg-bg-card/80 backdrop-blur-sm border border-bg-border/50 rounded-2xl mb-5 overflow-hidden shadow-lg">
      {/* En-tête panneau */}
      <div 
        className={`p-5 md:px-6 border-b border-bg-border/50 flex items-center justify-between cursor-pointer group transition-all duration-300 hover:bg-bg-border hover:border-accent-main/30 ${expanded ? '' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-main/20 via-accent-main/10 flex items-center justify-center border border-accent-main/40 shadow-md">
            <span className="text-xs uppercase tracking-[0.25em] text-accent-main font-medium">IA</span>
          </div>
          <div>
            <p className="text-text-primary text-base font-bold tracking-wide">
              Assistant IA — Aide à la décision
            </p>
            <p className="text-text-secondary text-xs mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
              Analyse hybride (règles métier + IA)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {analyse && <RiskBadge niveau={analyse.risque} />}
          <div className="w-8 h-8 rounded-lg bg-bg-border flex items-center justify-center transition-transform duration-300 group-hover:bg-accent-main/10">
            <svg className={`w-4 h-4 text-text-tertiary transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-6 space-y-6">
          {/* Bouton analyse */}
          {!analyse && !loading && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-main/10 flex items-center justify-center border border-accent-main/30 shadow-lg">
                <span className="text-xs uppercase tracking-[0.25em] text-accent-main font-medium">Analyse</span>
              </div>
              <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
                Lancer une analyse complète de cette demande de budget avec l'intelligence artificielle
              </p>
              <button
                onClick={lancerAnalyse}
                className="relative px-8 py-4 bg-gradient-to-r from-accent-main to-accent-hover hover:from-accent-hover text-text-primary font-semibold rounded-xl text-sm inline-flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-accent-main/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-xs uppercase tracking-[0.25em] text-text-primary/80 font-medium">Lancer</span>
                <span>Analyser ce budget</span>
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-10">
              <div className="relative w-24 h-24 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-main/20 to-accent-hover/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-2 border-accent-main/30 border-t-accent-main animate-spin"></div>
                <div className="absolute inset-4 rounded-full border-2 border-accent-hover/20 border-t-accent-hover animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs uppercase tracking-[0.25em] text-accent-main font-medium">Analyse</span>
                </div>
              </div>
              <p className="text-text-secondary text-sm mb-2">
                L'IA analyse les données budgétaires...
              </p>
              <p className="text-text-tertiary text-xs">
                Cette opération peut prendre quelques secondes
              </p>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="bg-error/10 backdrop-blur-sm border border-error/30 rounded-xl p-4 text-error text-sm flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-error/20 flex items-center justify-center text-xs uppercase tracking-[0.25em] font-medium">Alerte</span>
              {error}
            </div>
          )}

          {/* Résultats */}
          {analyse && !loading && (
            <div className="space-y-6">
              {/* Métriques */}
              <div className="bg-bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-bg-border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-lg bg-accent-main/20 flex items-center justify-center text-xs uppercase tracking-[0.25em] font-medium">Métriques</span>
                  <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold">Métriques analysées</p>
                </div>
                <BudgetAnalysisMetrics analyse={analyse} />
              </div>

              {/* Recommandation */}
              <AIRecommendationCard analyse={analyse} />

              {/* Postes analyse */}
              {analyse.postesAnalyse && analyse.postesAnalyse.length > 0 && (
                <div className="bg-bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-bg-border">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-lg bg-warning/20 flex items-center justify-center text-xs uppercase tracking-[0.25em] font-medium">Postes</span>
                    <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold">Analyse des postes</p>
                  </div>
                  <div className="space-y-2">
                    {analyse.postesAnalyse.map((p, i) => (
                      <div key={i} className={`p-4 rounded-xl flex justify-between items-center transition-all duration-200 hover:scale-[1.01] ${
                        p.anomalie 
                          ? 'bg-warning/10 border border-warning/30' 
                          : 'bg-success/5 border border-success/20'
                      }`}>
                        <div className="flex-1">
                          <p className="text-text-primary text-sm font-semibold flex items-center gap-2">
                            {p.nom}
                            {p.anomalie && <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span>}
                          </p>
                          <p className="text-text-secondary text-xs mt-1 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-bg-border text-text-tertiary text-xs">{p.categorie}</span>
                            <span className="text-text-tertiary">{p.montant.toLocaleString("fr-FR")} DT</span>
                            {p.anomalie && (
                              <span className="text-warning flex items-center gap-1">
                                <span className="text-xs uppercase tracking-[0.25em] font-medium">Anomalie</span> {p.commentaire}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          p.anomalie 
                            ? 'bg-warning/10' 
                            : 'bg-success/10'
                        }`}>
                          <span className={`text-xs uppercase tracking-[0.25em] font-medium ${p.anomalie ? 'text-warning' : 'text-success'}`}>
                            {p.anomalie ? "Erreur" : "OK"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {analyse.suggestions && analyse.suggestions.length > 0 && (
                <div className="bg-accent-main/5 backdrop-blur-sm border border-accent-main/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-lg bg-accent-main/30 flex items-center justify-center text-xs uppercase tracking-[0.25em] font-medium">Conseils</span>
                    <p className="text-accent-main text-xs uppercase tracking-wider font-semibold">Suggestions de l'IA</p>
                  </div>
                  <ul className="space-y-2 pl-2">
                    {analyse.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-accent-main text-sm leading-relaxed p-3 rounded-lg bg-accent-main/5 hover:bg-accent-main/10 transition-colors">
                        <span className="w-5 h-5 rounded-md bg-accent-main/20 flex items-center justify-center text-xs uppercase tracking-[0.25em] font-medium flex-shrink-0">Note</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer source */}
              <div className="flex items-center justify-between pt-4 border-t border-bg-border">
                <p className="text-text-tertiary text-xs">
                  Source: {analyse.justificationLLM ? "Analyse hybride (règles + LLM)" : "Analyse rule-based"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-text-tertiary text-xs">Score:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    analyse.score >= 50 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
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

