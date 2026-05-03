import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Dgsidebar from "./Dgsidebar"
import API from "../../api/axios"
import RiskBadge from "../ai/RiskBadge"

const QUICK_QUESTIONS = [
  "Quelles sont les directions à risque ?",
  "Résume les analyses du jour",
  "Quel est le budget total demandé ?",
  "Donne-moi les recommandations rejetées",
]

export default function AIAssistant() {
  const navigate = useNavigate()
  
  const [analyses, setAnalyses]     = useState([])
  const [filtered, setFiltered]     = useState([])
  const [loadingHist, setLoadingHist] = useState(true)
  const [erreurHist, setErreurHist]   = useState("")
  
  const [directionsEnAttente, setDirectionsEnAttente] = useState([])
  const [loadingDirections, setLoadingDirections] = useState(true)

  const [filterDirection, setFilterDirection] = useState("")
  const [filterRisque, setFilterRisque]       = useState("")
  const [filterReco, setFilterReco]           = useState("")

  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Bonjour DG. Posez-moi une question sur les budgets, les demandes ou les analyses." }
  ])
  const [question, setQuestion]   = useState("")
  const [loadingChat, setLoadingChat] = useState(false)
  const [erreurChat, setErreurChat]   = useState("")
  const chatEndRef = useRef(null)

  const [selectedAnalysis, setSelectedAnalysis] = useState(null)

  useEffect(() => {
    Promise.all([
      API.get("/ai/history?limit=50"),
      API.get("/directions")
    ])
      .then(([histRes, dirRes]) => {
        const data = histRes.data.data || []
        setAnalyses(data)
        setFiltered(data)
        
        const dirs = dirRes.data || []
        const enAttente = dirs.filter(d => d.statut === "en_attente")
        setDirectionsEnAttente(enAttente)
      })
      .catch(() => setErreurHist("Erreur chargement historique"))
      .finally(() => {
        setLoadingHist(false)
        setLoadingDirections(false)
      })
  }, [])

  useEffect(() => {
    let result = analyses
    if (filterDirection) {
      result = result.filter(a => a.directionCode?.toLowerCase().includes(filterDirection.toLowerCase()))
    }
    if (filterRisque) {
      result = result.filter(a => a.risque === filterRisque)
    }
    if (filterReco) {
      result = result.filter(a => a.recommandation === filterReco)
    }
    setFiltered(result)
  }, [filterDirection, filterRisque, filterReco, analyses])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const stats = {
    total: analyses.length,
    approuver: analyses.filter(a => a.recommandation === "APPROUVER").length,
    rejeter: analyses.filter(a => a.recommandation === "REJETER").length,
    risqueEleve: analyses.filter(a => a.risque === "ELEVE").length,
    moyenneScore: analyses.length > 0
      ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / analyses.length)
      : 0,
  }

  async function envoyerQuestion(e, qOverride = null) {
    if (e) e.preventDefault()
    const q = (qOverride || question).trim()
    if (!q) return

    setQuestion("")
    setChatMessages((prev) => [...prev, { role: "user", text: q }])
    setLoadingChat(true)
    setErreurChat("")

    try {
      const totalAlloue = analyses.reduce((s, a) => s + (a.budgetAlloue || 0), 0)
      const totalDemande = analyses.reduce((s, a) => s + (a.budgetDemande || 0), 0)
      const tauxGlobal = totalAlloue > 0 ? Math.round((totalDemande / totalAlloue) * 100) : 0

      const contextBudget = {
        type: "global",
        directionCode: "GLOBAL",
        budgetAlloue: totalAlloue,
        budgetDemande: totalDemande,
        tauxConsommation: tauxGlobal,
        resume: `Vue d'ensemble des analyses IA : ${stats.total} analyses effectuées. ${stats.approuver} recommandations d'approbation, ${stats.rejeter} recommandations de rejet. ${stats.risqueEleve} directions présentent un risque élevé. Score moyen global : ${stats.moyenneScore}/100. Budget total alloué : ${totalAlloue.toLocaleString("fr-FR")} DT. Demandes totales : ${totalDemande.toLocaleString("fr-FR")} DT. Taux global : ${tauxGlobal}%.`,
      }

      const res = await API.post("/ai/chat", { question: q, contextBudget })
      const reponse = res.data.reponse || "Réponse vide de l'IA."
      setChatMessages((prev) => [...prev, { role: "assistant", text: reponse }])
    } catch (err) {
      setErreurChat(err.response?.data?.message || "Erreur de communication avec l'IA")
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Attention : " + (err.response?.data?.message || "Erreur.") }
      ])
    } finally {
      setLoadingChat(false)
    }
  }

  async function supprimerAnalyse(id) {
    if (!confirm("Supprimer cette analyse ?")) return
    try {
      await API.delete(`/ai/history/${id}`)
      setAnalyses((prev) => prev.filter(a => a._id !== id))
    } catch {
      alert("Erreur suppression")
    }
  }

  function fmtDate(d) {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-bg-global text-text-primary flex overflow-hidden">
      <Dgsidebar />

      <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Assistant IA — Aide à la décision</h1>
          <p className="text-text-secondary">Historique analyses et chat IA budgets.</p>
        </div>

        {/* Stats globales */}
        {!loadingHist && analyses.length > 0 && (
          <div className="grid grid-cols-5 gap-3 mb-6">
{[
              { label: "Total", value: stats.total, color: "accent-main", icon: "TOTAL" },
              { label: "Approuvées", value: stats.approuver, color: "accent-main", icon: "APPROUVER" },
              { label: "Rejetées", value: stats.rejeter, color: "accent-main", icon: "REJETER" },
              { label: "Risque Élevé", value: stats.risqueEleve, color: "warning", icon: "RISQUE" },
              { label: "Score moyen", value: stats.moyenneScore + "/100", color: "text-secondary", icon: "SCORE" },
            ].map((s, i) => (
              <div key={i} className="bg-bg-card border border-bg-border rounded-xl p-4 text-center transition-all hover:scale-105">
                <div className={`text-2xl mb-1 ${s.color}`}>{s.icon}</div>
                <p className={`${
s.color} text-lg font-bold mb-1`}>{s.value}</p>
                <p className="text-text-tertiary text-xs uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Directions attente */}
        {!loadingDirections && directionsEnAttente.length > 0 && (
          <div className="mb-6">
            <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold mb-3">
              Demandes attente analyse ({directionsEnAttente.length})
            </p>
            <div className="flex gap-2 flex-wrap">
              {directionsEnAttente.map((d) => (
                <button
                  key={d._id}
                  onClick={() => navigate(`/dg/demandes/${d._id}`)}
                  className="bg-bg-card border border-accent-main/30 hover:border-accent-main hover:bg-accent-main/5 text-text-primary px-4 py-3 rounded-lg flex flex-col items-start min-w-[140px] transition-all text-sm font-medium hover:scale-[1.02]"
                >
                  <span className="font-semibold">{d.code}</span>
                  <span className="text-text-secondary text-xs">{d.totalDemande?.toLocaleString("fr-FR")} DT</span>
                  <span className="text-accent-main text-xs mt-1 uppercase tracking-wider font-medium">Analyser</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Historique */}
          <div className="bg-bg-card border border-bg-border rounded-2xl p-6 h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold">
                Historique IA ({filtered.length})
              </p>
            </div>

            {/* Filtres */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <input
                type="text"
placeholder="Filtre direction"
                value={filterDirection}
                onChange={(e) => setFilterDirection(e.target.value)}
                className="flex-1 min-w-[120px] bg-bg-border border border-bg-border/50 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-main placeholder-text-tertiary focus:outline-none"
              />
              <select
                value={filterRisque}
                onChange={(e) => setFilterRisque(e.target.value)}
                className="bg-bg-border border border-bg-border/50 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-main focus:outline-none"
              >
                <option value="">Risques</option>
                <option value="FAIBLE">Faible</option>
                <option value="MOYEN">Moyen</option>
                <option value="ELEVE">Élevé</option>
              </select>
              <select
                value={filterReco}
                onChange={(e) => setFilterReco(e.target.value)}
                className="bg-bg-border border border-bg-border/50 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-main focus:outline-none"
              >
                <option value="">Recommandation</option>
                <option value="APPROUVER">Approuver</option>
                <option value="REJETER">Rejeter</option>
              </select>
              {(filterDirection || filterRisque || filterReco) && (
                <button
                  onClick={() => { setFilterDirection(""); setFilterRisque(""); setFilterReco("") }}
                  className="bg-bg-border/50 hover:bg-bg-border text-text-tertiary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {loadingHist && (
              <div className="flex flex-col items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-accent-main/20 border-t-accent-main rounded-full animate-spin mb-3" />
                <p className="text-text-secondary text-sm">Chargement analyses...</p>
              </div>
            )}

            {erreurHist && (
              <div className="bg-error/10 border border-error/30 rounded-xl p-4 text-error text-sm flex items-center gap-2">
Erreur {erreurHist}
              </div>
            )}

            {!loadingHist && !erreurHist && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <p className="text-text-secondary text-sm mb-2">
                  {analyses.length === 0 ? "Aucune analyse." : "Aucun résultat filtres."}
                </p>
                {analyses.length === 0 && (
                  <p className="text-text-tertiary text-xs">
                    Analyses apparaissent après "Analyser budget" demande attente.
                  </p>
                )}
              </div>
            )}

            {!loadingHist && filtered.length > 0 && (
              <div className="space-y-2 max-h-[450px] overflow-y-auto">
                {filtered.map((a) => (
                  <div key={a._id}>
                    <div
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        selectedAnalysis === a._id 
                          ? 'bg-accent-main/10 border-accent-main shadow-md' 
                          : 'bg-bg-card/50 border-bg-border hover:bg-bg-card hover:shadow-md'
                      }`}
                      onClick={() => setSelectedAnalysis(selectedAnalysis === a._id ? null : a._id)}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-text-primary font-semibold text-sm">{a.directionCode}</span>
                            <RiskBadge niveau={a.risque} />
                            <span className={`text-sm font-bold px-2 py-1 rounded-md ${
                              a.recommandation === "APPROUVER" ? "bg-success/20 text-success" : "bg-error/20 text-error"
                            }`}>
                              {a.recommandation} 
                            </span>
                          </div>
                          <p className="text-text-tertiary text-xs mb-1">{a.directionNom || "Direction sans nom"}</p>
                          <p className="text-text-secondary text-xs">
                            Budget: {a.budgetAlloue?.toLocaleString("fr-FR")} DT · Demande: {a.budgetDemande?.toLocaleString("fr-FR")} DT · Score: {a.score}/100
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs">
                          <p className="text-text-tertiary">{fmtDate(a.createdAt)}</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); supprimerAnalyse(a._id) }}
                            className="text-error hover:text-error/80 px-2 py-1 rounded text-xs font-medium hover:bg-error/10 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>

                    {selectedAnalysis === a._id && (
                      <div className={`mt-2 p-4 rounded-xl border ${
                        a.recommandation === "APPROUVER" 
                          ? 'bg-success/5 border-success/20' 
                          : 'bg-error/5 border-error/20'
                      }`}>
                        <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                          Justification <span className="w-2 h-2 rounded-full bg-accent-main animate-pulse"></span>
                        </p>
                        <p className="text-text-primary text-sm leading-relaxed mb-4">{a.justification}</p>

                        {a.facteurs && a.facteurs.length > 0 && (
                          <>
                            <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold mb-2">Facteurs</p>
                            <div className="space-y-2 mb-4">
                              {a.facteurs.map((f, i) => (
                                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                                  f.impact === "positif" ? "bg-success/10 border border-success/20" 
                                  : f.impact === "negatif" ? "bg-error/10 border border-error/20" 
                                  : "bg-bg-card/50 border border-bg-border"
                                }`}>
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    f.impact === "positif" ? "text-success bg-success/20" 
                                    : f.impact === "negatif" ? "text-error bg-error/20" 
                                    : "text-text-secondary bg-bg-border/50"
                                  }`}>
                                    {f.impact === "positif" ? "Positif" : f.impact === "negatif" ? "Négatif" : "Neutre"}
                                  </span>
                                  <span className="text-text-primary text-sm">{f.detail}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {a.suggestions && a.suggestions.length > 0 && (
                          <>
                            <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold mb-2">Suggestions</p>
                            <ul className="text-accent-main text-sm space-y-1 pl-4 list-disc list-inside">
                              {a.suggestions.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="lg:h-[600px] bg-bg-card border border-bg-border rounded-2xl flex flex-col overflow-hidden">
            {/* Header chat */}
            <div className="p-4 border-b border-bg-border flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-accent-main/20 flex items-center justify-center text-xs uppercase tracking-wider font-semibold text-accent-main">
                Chat
              </div>
              <div>
                <p className="text-text-primary font-semibold text-sm">Chat IA</p>
                <p className="text-text-secondary text-xs">Questions budgets</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "self-end bg-accent-main text-text-primary rounded-br-sm" 
                      : "self-start bg-bg-card/50 backdrop-blur-sm border border-bg-border rounded-br-sm"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loadingChat && (
                <div className="self-start flex gap-1 p-3">
                  <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{animationDelay: '0s'}} />
                  <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{animationDelay: '0.16s'}} />
                  <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{animationDelay: '0.32s'}} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick questions */}
            <div className="p-2 border-t border-bg-border flex gap-2 flex-wrap px-3">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => envoyerQuestion(null, q)}
                  disabled={loadingChat}
                  className="bg-bg-border/50 hover:bg-bg-border text-text-tertiary px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={envoyerQuestion} className="p-3 border-t border-bg-border flex gap-2">
              <input
                type="text"
                placeholder="Posez question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loadingChat}
                className="flex-1 bg-bg-border border border-bg-border/50 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-main focus:outline-none placeholder-text-tertiary disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loadingChat || !question.trim()}
                className="bg-accent-main hover:bg-accent-hover text-text-primary px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                Envoyer
              </button>
            </form>

            {erreurChat && (
              <p className="text-error text-xs p-3 border-t border-bg-border">
Erreur {erreurChat}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

