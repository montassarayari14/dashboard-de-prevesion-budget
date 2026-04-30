import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DirecteurSidebar from "../../component/directeur/DirecteurSidebar"
import StatutBadge from "../../component/directeur/StatutBadge"
import API from "../../api/axios"

export default function DirecteurDashboard() {
  const [direction, setDirection] = useState(null)
  const [loading, setLoading]     = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    // Charge la direction de l'utilisateur connecté
    API.get("/directions/ma-direction")
      .then((res) => setDirection(res.data))
      .finally(() => setLoading(false))
  }, [])

async function handleSoumettre() {
    if (!direction || direction.statut !== "brouillon") return
    if (!window.confirm("Confirmer la soumission à la Direction Générale ?")) return
    try {
      const res = await API.put(`/directions/${direction._id}/soumettre`, {
        postes: direction.postes
      })
      setDirection(res.data)
    } catch {
      alert("Erreur lors de la soumission")
    }
  }

  async function handleReset() {
    if (!direction || direction.statut === "brouillon") return
    if (!window.confirm("Réinitialiser la demande? Vous devrez recommencer.")) return
    try {
      const res = await API.put(`/directions/${direction._id}/reset`)
      setDirection(res.data)
      alert("Demande réinitialisée. Cliquez sur 'Mon budget' pour modifier.")
    } catch {
      alert("Erreur lors de la réinitialisation")
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050b1a", display: "flex" }}>
      <DirecteurSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#475569" }}>Chargement...</p>
      </div>
    </div>
  )

  if (!direction) return (
    <div style={{ minHeight: "100vh", background: "#050b1a", display: "flex" }}>
      <DirecteurSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#f87171" }}>Aucune direction assignée. Contactez l'administrateur.</p>
      </div>
    </div>
  )

  const totalEstime  = direction.postes?.reduce((s, p) => s + (p.montant || 0), 0) || 0
  const totalN1      = direction.postes?.reduce((s, p) => s + (p.montantN1 || 0), 0) || 0
  const reste        = (direction.budget || 0) - totalEstime
  const pctUtil      = direction.budget ? Math.round((totalEstime / direction.budget) * 100) : 0
  const pctVsN1      = totalN1 > 0 ? Math.round(((totalEstime - totalN1) / totalN1) * 100) : 0

  // Répartition par catégorie
  const parCategorie = {}
  direction.postes?.forEach((p) => {
    parCategorie[p.categorie] = (parCategorie[p.categorie] || 0) + (p.montant || 0)
  })

  const catColors = {
    "Informatique":   "#6366f1",
    "RH / Formation": "#a855f7",
    "Infrastructure": "#f59e0b",
    "Général":        "#22c55e",
    "Autre":          "#64748b",
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050b1a", color: "#fff", display: "flex" }}>
      <DirecteurSidebar />

      <div style={{ flex: 1, padding: "24px" }}>

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0" }}>Tableau de bord</h1>
            <p style={{ color: "#64748b", margin: 0 }}>Direction {direction.nom} · Campagne 2025</p>
          </div>
          <StatutBadge statut={direction.statut || "brouillon"} />
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Budget alloué",    value: `${(direction.budget || 0).toLocaleString("fr-FR")} DT`,  color: "#818cf8" },
            { label: "Total estimé",     value: `${totalEstime.toLocaleString("fr-FR")} DT`,              color: "#fbbf24" },
            { label: "Reste disponible", value: `${reste.toLocaleString("fr-FR")} DT`,                    color: reste >= 0 ? "#4ade80" : "#f87171" },
            { label: "vs 2024",          value: `${pctVsN1 > 0 ? "+" : ""}${pctVsN1}%`,                  color: "#c084fc" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px" }}>
              <p style={{ color: "#64748b", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 0" }}>{k.label}</p>
              <p style={{ color: k.color, fontSize: "22px", fontWeight: "700", margin: 0 }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Grille principale */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "16px" }}>

          {/* Répartition par catégorie */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 16px 0" }}>Répartition par catégorie</h2>
            {Object.entries(parCategorie).map(([cat, montant]) => {
              const pct = totalEstime > 0 ? Math.round((montant / totalEstime) * 100) : 0
              return (
                <div key={cat} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span style={{ color: "#94a3b8" }}>{cat}</span>
                    <span style={{ color: catColors[cat] || "#64748b", fontFamily: "monospace" }}>
                      {montant.toLocaleString("fr-FR")} DT · {pct}%
                    </span>
                  </div>
                  <div style={{ background: "#1e293b", borderRadius: "4px", height: "5px" }}>
                    <div style={{ width: `${pct}%`, height: "5px", borderRadius: "4px", background: catColors[cat] || "#64748b" }} />
                  </div>
                </div>
              )
            })}
            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "10px", marginTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: "#64748b" }}>{direction.postes?.length || 0} postes de dépenses</span>
              <span style={{ color: "#fbbf24", fontWeight: "600" }}>
                {totalEstime.toLocaleString("fr-FR")} / {(direction.budget || 0).toLocaleString("fr-FR")} DT
              </span>
            </div>
          </div>

          {/* Droite : jauge + statut */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Jauge utilisation */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 12px 0" }}>Utilisation de l'enveloppe</h2>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ color: "#64748b", fontSize: "12px" }}>{totalEstime.toLocaleString("fr-FR")} / {(direction.budget || 0).toLocaleString("fr-FR")} DT</span>
                <span style={{ color: pctUtil > 100 ? "#f87171" : "#818cf8", fontWeight: "700", fontSize: "18px" }}>{pctUtil}%</span>
              </div>
              <div style={{ background: "#1e293b", borderRadius: "6px", height: "8px" }}>
                <div style={{ width: `${Math.min(pctUtil, 100)}%`, height: "8px", borderRadius: "6px", background: pctUtil > 100 ? "#dc2626" : "#6366f1" }} />
              </div>
              {pctUtil > 100 && (
                <p style={{ color: "#f87171", fontSize: "11px", marginTop: "6px" }}>⚠ Dépassement de l'enveloppe !</p>
              )}
            </div>

            {/* Statut de la demande */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 14px 0" }}>Statut de la demande</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Statut actuel</span>
                  <StatutBadge statut={direction.statut || "brouillon"} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Soumis à la DG</span>
                  <span style={{ color: direction.soumisLe ? "#4ade80" : "#475569", fontFamily: "monospace", fontSize: "12px" }}>
                    {direction.soumisLe ? new Date(direction.soumisLe).toLocaleDateString("fr-FR") : "Non encore"}
                  </span>
                </div>
                {direction.commentaireDG && (
                  <div style={{ background: "#1c1300", border: "1px solid #451a03", borderRadius: "8px", padding: "10px" }}>
                    <p style={{ color: "#fbbf24", fontSize: "11px", fontWeight: "600", margin: "0 0 4px 0" }}>Commentaire DG</p>
                    <p style={{ color: "#d4a200", fontSize: "12px", margin: 0 }}>{direction.commentaireDG}</p>
                  </div>
                )}
              </div>

{/* Bouton soumettre */}
              {direction.statut === "brouillon" && (
                <button onClick={handleSoumettre} style={{
                  width: "100%", marginTop: "14px", padding: "10px",
                  background: "#4f46e5", border: "none", borderRadius: "10px",
                  color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer"
                }}>
                  Soumettre à la DG
                </button>
              )}
              {direction.statut === "rejete" && (
                <button onClick={() => navigate("/direction/budget")} style={{
                  width: "100%", marginTop: "14px", padding: "10px",
                  background: "#7f1d1d", border: "none", borderRadius: "10px",
                  color: "#fca5a5", fontSize: "13px", fontWeight: "600", cursor: "pointer"
                }}>
                  Réviser et resoumettre
                </button>
              )}
              {direction.statut === "en_attente" && (
                <button onClick={handleReset} style={{
                  width: "100%", marginTop: "14px", padding: "10px",
                  background: "#475569", border: "none", borderRadius: "10px",
                  color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer"
                }}>
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}