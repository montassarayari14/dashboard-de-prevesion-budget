import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import DGSidebar from "../../component/dg/DGSidebar"
import API from "../../api/axios"
import RiskBadge from "../../component/ai/RiskBadge"

// ─── Suggestions rapides pour le chat ───
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
  
  // ─── Directions en attente (non encore analysées) ───
  const [directionsEnAttente, setDirectionsEnAttente] = useState([])
  const [loadingDirections, setLoadingDirections] = useState(true)

  // ─── Filtres ───
  const [filterDirection, setFilterDirection] = useState("")
  const [filterRisque, setFilterRisque]       = useState("")
  const [filterReco, setFilterReco]           = useState("")

  // ─── Chat ───
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Bonjour DG. Posez-moi une question sur les budgets, les demandes ou les analyses." }
  ])
  const [question, setQuestion]   = useState("")
  const [loadingChat, setLoadingChat] = useState(false)
  const [erreurChat, setErreurChat]   = useState("")
  const chatEndRef = useRef(null)

// ─── Détail d'une analyse ───
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)

  // ─── Charge l'historique ───
  useEffect(() => {
    Promise.all([
      API.get("/ai/history?limit=50"),
      API.get("/directions")
    ])
      .then(([histRes, dirRes]) => {
        const data = histRes.data.data || []
        setAnalyses(data)
        setFiltered(data)
        
        // Filtrer les directions en attente qui n'ont pas encore été analysées
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

  // ─── Applique les filtres ───
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

  // ─── Auto-scroll du chat ───
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // ─── Stats globales ───
  const stats = {
    total: analyses.length,
    approuver: analyses.filter(a => a.recommandation === "APPROUVER").length,
    rejeter: analyses.filter(a => a.recommandation === "REJETER").length,
    risqueEleve: analyses.filter(a => a.risque === "ELEVE").length,
    moyenneScore: analyses.length > 0
      ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / analyses.length)
      : 0,
  }

  // ─── Envoi question chat ───
  async function envoyerQuestion(e, qOverride = null) {
    if (e) e.preventDefault()
    const q = (qOverride || question).trim()
    if (!q) return

    setQuestion("")
    setChatMessages((prev) => [...prev, { role: "user", text: q }])
    setLoadingChat(true)
    setErreurChat("")

    try {
      // Contexte enrichi avec les stats réelles — format compatible backend
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
      setErreurChat(err.response?.data?.message || "Erreur lors de l'envoi")
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ " + (err.response?.data?.message || "Erreur de communication avec l'IA.") }
      ])
    } finally {
      setLoadingChat(false)
    }
  }

  // ─── Supprimer une analyse ───
  async function supprimerAnalyse(id) {
    if (!confirm("Supprimer cette analyse ?")) return
    try {
      await API.delete(`/ai/history/${id}`)
      setAnalyses((prev) => prev.filter(a => a._id !== id))
    } catch {
      alert("Erreur lors de la suppression")
    }
  }

  // ─── Format date ───
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
    <div style={{ minHeight: "100vh", background: "#050b1a", color: "#ffffff", display: "flex" }}>
      <DGSidebar />

      <div style={{ flex: 1, padding: "24px", maxWidth: "1400px" }}>
        {/* En-tête */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 6px 0" }}>
            🤖 Assistant IA — Aide à la décision
          </h1>
          <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>
            Historique des analyses budgétaires et chat interactif avec l'assistant intelligent.
          </p>
        </div>

{/* ─── Statistiques globales ─── */}
        {!loadingHist && analyses.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "12px",
            marginBottom: "20px"
          }}>
            {[
              { label: "Total analyses", value: stats.total, color: "#818cf8", icon: "📊" },
              { label: "À approuver", value: stats.approuver, color: "#4ade80", icon: "✅" },
              { label: "À rejeter", value: stats.rejeter, color: "#f87171", icon: "❌" },
              { label: "Risques élevés", value: stats.risqueEleve, color: "#fbbf24", icon: "🔴" },
              { label: "Score moyen", value: stats.moyenneScore + "/100", color: "#94a3b8", icon: "📈" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "10px",
                padding: "14px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
                <p style={{ color: s.color, fontSize: "20px", fontWeight: "700", margin: "0 0 2px 0" }}>
                  {s.value}
                </p>
                <p style={{ color: "#475569", fontSize: "11px", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ─── Directions en attente d'analyse ─── */}
        {!loadingDirections && directionsEnAttente.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{
              color: "#94a3b8",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "10px"
            }}>
              📋 Demandes en attente d'analyse ({directionsEnAttente.length})
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {directionsEnAttente.map((d) => (
                <button
                  key={d._id}
                  onClick={() => navigate(`/dg/demandes/${d._id}`)}
                  style={{
                    background: "#1e1b4b",
                    border: "1px solid #4338ca",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    minWidth: "160px",
                  }}
                >
                  <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: "600" }}>
                    {d.code}
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "11px" }}>
                    {d.totalDemande?.toLocaleString("fr-FR")} DT
                  </span>
                  <span style={{ color: "#fbbf24", fontSize: "10px", marginTop: "4px" }}>
                    → Analyser
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px" }}>
          {/* ─── Colonne gauche : Historique ─── */}
          <div>
            <div style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "14px",
              padding: "20px",
              minHeight: "600px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <p style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  margin: 0,
                }}>
                  📊 Historique des analyses IA ({filtered.length})
                </p>
              </div>

              {/* ─── Filtres ─── */}
              <div style={{
                display: "flex",
                gap: "10px",
                marginBottom: "16px",
                flexWrap: "wrap"
              }}>
                <input
                  type="text"
                  placeholder="Filtrer par direction..."
                  value={filterDirection}
                  onChange={(e) => setFilterDirection(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: "140px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "#ffffff",
                    fontSize: "12px",
                    outline: "none",
                  }}
                />
                <select
                  value={filterRisque}
                  onChange={(e) => setFilterRisque(e.target.value)}
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "#ffffff",
                    fontSize: "12px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Tous risques</option>
                  <option value="FAIBLE">🟢 Faible</option>
                  <option value="MOYEN">🟡 Moyen</option>
                  <option value="ELEVE">🔴 Élevé</option>
                </select>
                <select
                  value={filterReco}
                  onChange={(e) => setFilterReco(e.target.value)}
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "#ffffff",
                    fontSize: "12px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Toutes reco</option>
                  <option value="APPROUVER">✅ Approuver</option>
                  <option value="REJETER">❌ Rejeter</option>
                </select>
                {(filterDirection || filterRisque || filterReco) && (
                  <button
                    onClick={() => { setFilterDirection(""); setFilterRisque(""); setFilterReco("") }}
                    style={{
                      background: "#334155",
                      border: "none",
                      color: "#ffffff",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {loadingHist && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    border: "3px solid #1e293b",
                    borderTop: "3px solid #6366f1",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 12px",
                  }} />
                  <p style={{ color: "#64748b", fontSize: "13px" }}>Chargement des analyses...</p>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {erreurHist && (
                <div style={{
                  background: "#450a0a",
                  border: "1px solid #dc2626",
                  borderRadius: "10px",
                  padding: "12px",
                  color: "#f87171",
                  fontSize: "13px",
                }}>
                  ⚠️ {erreurHist}
                </div>
              )}

              {!loadingHist && !erreurHist && filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <p style={{ color: "#475569", fontSize: "13px", margin: "0 0 8px 0" }}>
                    {analyses.length === 0 ? "Aucune analyse enregistrée." : "Aucun résultat pour ces filtres."}
                  </p>
                  {analyses.length === 0 && (
                    <p style={{ color: "#334155", fontSize: "12px", margin: 0 }}>
                      Les analyses apparaissent ici après avoir cliqué sur "Analyser ce budget" dans une demande en attente.
                    </p>
                  )}
                </div>
              )}

              {!loadingHist && filtered.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {filtered.map((a) => (
                    <div key={a._id}>
                      <div
                        style={{
                          background: selectedAnalysis === a._id ? "#1e1b4b" : "#0f172a",
                          border: `1px solid ${selectedAnalysis === a._id ? "#4338ca" : "#1e293b"}`,
                          borderRadius: "10px",
                          padding: "14px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onClick={() => setSelectedAnalysis(selectedAnalysis === a._id ? null : a._id)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                              <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "600" }}>
                                {a.directionCode}
                              </span>
                              <RiskBadge niveau={a.risque} />
                              <span style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                color: a.recommandation === "APPROUVER" ? "#4ade80" : "#f87171",
                              }}>
                                {a.recommandation === "APPROUVER" ? "✅" : "❌"} {a.recommandation}
                              </span>
                            </div>
                            <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 2px 0" }}>
                              {a.directionNom || "Direction sans nom"}
                            </p>
                            <p style={{ color: "#475569", fontSize: "11px", margin: 0 }}>
                              Budget: {a.budgetAlloue?.toLocaleString("fr-FR")} DT · Demande:{" "}
                              {a.budgetDemande?.toLocaleString("fr-FR")} DT · Score: {a.score}/100
                            </p>
                          </div>
                          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                            <p style={{ color: "#475569", fontSize: "11px", margin: 0 }}>
                              {fmtDate(a.createdAt)}
                            </p>
                            <button
                              onClick={(e) => { e.stopPropagation(); supprimerAnalyse(a._id) }}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#f87171",
                                fontSize: "11px",
                                cursor: "pointer",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* ─── Détail expansible ─── */}
                      {selectedAnalysis === a._id && (
                        <div style={{
                          background: "#0f172a",
                          border: "1px solid #312e81",
                          borderTop: "none",
                          borderRadius: "0 0 10px 10px",
                          padding: "14px",
                          marginTop: "-6px",
                          marginBottom: "6px",
                        }}>
                          <p style={{ color: "#94a3b8", fontSize: "11px", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            📝 Justification
                          </p>
                          <p style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "1.6", margin: "0 0 14px 0" }}>
                            {a.justification}
                          </p>

                          {a.facteurs && a.facteurs.length > 0 && (
                            <>
                              <p style={{ color: "#94a3b8", fontSize: "11px", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                📊 Facteurs d'analyse
                              </p>
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
                                {a.facteurs.map((f, i) => (
                                  <div key={i} style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "8px",
                                    padding: "8px 10px",
                                    borderRadius: "8px",
                                    background: f.impact === "positif" ? "#064e3b" : f.impact === "negatif" ? "#7f1d1d" : "#1e293b",
                                    fontSize: "12px",
                                  }}>
                                    <span style={{ flexShrink: 0 }}>
                                      {f.impact === "positif" ? "✅" : f.impact === "negatif" ? "❌" : "⚠️"}
                                    </span>
                                    <span style={{ color: "#e2e8f0" }}>{f.detail}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {a.suggestions && a.suggestions.length > 0 && (
                            <>
                              <p style={{ color: "#94a3b8", fontSize: "11px", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                💡 Suggestions
                              </p>
                              <ul style={{ margin: 0, paddingLeft: "18px", color: "#c7d2fe", fontSize: "12px", lineHeight: "1.7" }}>
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
          </div>

          {/* ─── Colonne droite : Chat IA ─── */}
          <div style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "14px",
            display: "flex",
            flexDirection: "column",
            height: "600px",
            overflow: "hidden",
          }}>
            {/* Header chat */}
            <div style={{
              padding: "14px 16px",
              borderBottom: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <span style={{ fontSize: "18px" }}>💬</span>
              <div>
                <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: "600", margin: 0 }}>
                  Chat avec l'IA
                </p>
                <p style={{ color: "#475569", fontSize: "11px", margin: "2px 0 0 0" }}>
                  Posez vos questions budgétaires
                </p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    background: msg.role === "user" ? "#4f46e5" : "#1e293b",
                    color: "#ffffff",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {loadingChat && (
                <div style={{ alignSelf: "flex-start", display: "flex", gap: "4px", padding: "10px 14px" }}>
                  <span style={{ width: "8px", height: "8px", background: "#64748b", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0s" }} />
                  <span style={{ width: "8px", height: "8px", background: "#64748b", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.16s" }} />
                  <span style={{ width: "8px", height: "8px", background: "#64748b", borderRadius: "50%", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.32s" }} />
                  <style>{`
                    @keyframes bounce {
                      0%, 80%, 100% { transform: scale(0); }
                      40% { transform: scale(1); }
                    }
                  `}</style>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Questions rapides */}
            <div style={{ padding: "8px 14px", borderTop: "1px solid #1e293b", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => envoyerQuestion(null, q)}
                  disabled={loadingChat}
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#94a3b8",
                    fontSize: "11px",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={envoyerQuestion} style={{ padding: "10px 14px", borderTop: "1px solid #1e293b", display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Posez votre question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loadingChat}
                style={{
                  flex: 1,
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: "#ffffff",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={loadingChat || !question.trim()}
                style={{
                  background: "#4f46e5",
                  border: "none",
                  color: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  opacity: loadingChat || !question.trim() ? 0.6 : 1,
                }}
              >
                Envoyer
              </button>
            </form>

            {erreurChat && (
              <p style={{ color: "#f87171", fontSize: "11px", padding: "0 14px 8px", margin: 0 }}>
                ⚠️ {erreurChat}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

