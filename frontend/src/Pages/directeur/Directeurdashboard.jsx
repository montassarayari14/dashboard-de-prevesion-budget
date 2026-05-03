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
    if (!window.confirm("Réinitialiser la demande ? Toutes les décisions précédentes seront réinitialisées.")) return
    try {
      const res = await API.put(`/directions/${direction._id}/reset`)
      setDirection(res.data)
      alert("Demande réinitialisée. Vous pouvez maintenant créer ou modifier votre budget.")
      navigate("/direction/budget")
    } catch {
      alert("Erreur lors de la réinitialisation")
    }
  }

  async function handleNewRequest() {
    if (!direction || direction.statut === "brouillon") return
    if (!window.confirm("Démarrer une nouvelle demande vide ? Les postes précédents seront supprimés.")) return
    try {
      const res = await API.put(`/directions/${direction._id}/reset?clear=true`)
      setDirection(res.data)
      alert("Nouvelle demande initialisée. Vous pouvez maintenant saisir un nouveau budget.")
      navigate("/direction/budget")
    } catch {
      alert("Erreur lors de l'initialisation de la nouvelle demande")
    }
  }

if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6", display: "flex" }}>
      <DirecteurSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6B7280" }}>Chargement...</p>
      </div>
    </div>
  )

  if (!direction) return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6", display: "flex" }}>
      <DirecteurSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#DC2626" }}>Aucune direction assignée. Contactez l'administrateur.</p>
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
    <div style={{ minHeight: "100vh", background: "#F3F4F6", color: "#111827", display: "flex" }}>
      <DirecteurSidebar />

      <div style={{ flex: 1, padding: "24px" }}>

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0" }}>Tableau de bord</h1>
            <p style={{ color: "#6B7280", margin: 0 }}>Direction {direction.nom} · Campagne 2025</p>
          </div>
          <StatutBadge statut={direction.statut || "brouillon"} />
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Budget alloué",    value: `${(direction.budget || 0).toLocaleString("fr-FR")} DT`,  color: "#2563EB" },
            { label: "Total estimé",     value: `${totalEstime.toLocaleString("fr-FR")} DT`,              color: "#F59E0B" },
            { label: "Reste disponible", value: `${reste.toLocaleString("fr-FR")} DT`,                    color: reste >= 0 ? "#16A34A" : "#DC2626" },
            { label: "vs 2024",          value: `${pctVsN1 > 0 ? "+" : ""}${pctVsN1}%`,                  color: "#F59E0B" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <p style={{ color: "#6B7280", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 0" }}>{k.label}</p>
              <p style={{ color: k.color, fontSize: "22px", fontWeight: "700", margin: 0 }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Grille principale */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "16px" }}>

{/* Répartition par catégorie */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 16px 0" }}>Répartition par catégorie</h2>
            {Object.entries(parCategorie).map(([cat, montant]) => {
              const pct = totalEstime > 0 ? Math.round((montant / totalEstime) * 100) : 0
              return (
                <div key={cat} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span style={{ color: "#6B7280" }}>{cat}</span>
                    <span style={{ color: catColors[cat] || "#6B7280", fontFamily: "monospace" }}>
                      {montant.toLocaleString("fr-FR")} DT · {pct}%
                    </span>
                  </div>
                  <div style={{ background: "#E5E7EB", borderRadius: "4px", height: "5px" }}>
                    <div style={{ width: `${pct}%`, height: "5px", borderRadius: "4px", background: catColors[cat] || "#6B7280" }} />
                  </div>
                </div>
              )
            })}
            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "10px", marginTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: "#6B7280" }}>{direction.postes?.length || 0} postes de dépenses</span>
              <span style={{ color: "#F59E0B", fontWeight: "600" }}>
                {totalEstime.toLocaleString("fr-FR")} / {(direction.budget || 0).toLocaleString("fr-FR")} DT
              </span>
            </div>
          </div>

          {/* Droite : jauge + statut */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

{/* Jauge utilisation */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 12px 0" }}>Utilisation de l'enveloppe</h2>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ color: "#6B7280", fontSize: "12px" }}>{totalEstime.toLocaleString("fr-FR")} / {(direction.budget || 0).toLocaleString("fr-FR")} DT</span>
                <span style={{ color: pctUtil > 100 ? "#DC2626" : "#2563EB", fontWeight: "700", fontSize: "18px" }}>{pctUtil}%</span>
              </div>
              <div style={{ background: "#E5E7EB", borderRadius: "6px", height: "8px" }}>
                <div style={{ width: `${Math.min(pctUtil, 100)}%`, height: "8px", borderRadius: "6px", background: pctUtil > 100 ? "#DC2626" : "#2563EB" }} />
              </div>
              {pctUtil > 100 && (
                <p style={{ color: "#DC2626", fontSize: "11px", marginTop: "6px" }}>Dépassement de l'enveloppe détecté.</p>
              )}
            </div>

            {/* Statut de la demande */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 14px 0" }}>Statut de la demande</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6B7280" }}>Statut actuel</span>
                  <StatutBadge statut={direction.statut || "brouillon"} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6B7280" }}>Soumis à la DG</span>
                  <span style={{ color: direction.soumisLe ? "#16A34A" : "#6B7280", fontFamily: "monospace", fontSize: "12px" }}>
                    {direction.soumisLe ? new Date(direction.soumisLe).toLocaleDateString("fr-FR") : "Non encore"}
                  </span>
                </div>
                {direction.commentaireDG && (
                  <div style={{ background: "#FEF3C7", border: "1px solid #F59E0B", borderRadius: "8px", padding: "10px" }}>
                    <p style={{ color: "#F59E0B", fontSize: "11px", fontWeight: "600", margin: "0 0 4px 0" }}>Commentaire DG</p>
                    <p style={{ color: "#111827", fontSize: "12px", margin: 0 }}>{direction.commentaireDG}</p>
                  </div>
                )}
              </div>

{/* Bouton soumettre */}
              {direction.statut === "brouillon" && (
                <button onClick={handleSoumettre} style={{
                  width: "100%", marginTop: "14px", padding: "10px",
                  background: "#2563EB", border: "none", borderRadius: "10px",
                  color: "#FFFFFF", fontSize: "13px", fontWeight: "600", cursor: "pointer"
                }}>
                  Soumettre à la DG
                </button>
              )}
              {direction.statut === "rejete" && (
                <>
                  <button onClick={() => navigate("/direction/budget")} style={{
                    width: "100%", marginTop: "14px", padding: "10px",
                    background: "#DC2626", border: "none", borderRadius: "10px",
                    color: "#FFFFFF", fontSize: "13px", fontWeight: "600", cursor: "pointer"
                  }}>
                    Réviser et resoumettre
                  </button>
                  <button onClick={handleNewRequest} style={{
                    width: "100%", marginTop: "10px", padding: "10px",
                    background: "#2563EB", border: "none", borderRadius: "10px",
                    color: "#FFFFFF", fontSize: "13px", fontWeight: "600", cursor: "pointer"
                  }}>
                    Nouvelle demande
                  </button>
                </>
              )}
              {direction.statut === "approuve" && (
                <button onClick={handleNewRequest} style={{
                  width: "100%", marginTop: "14px", padding: "10px",
                  background: "#2563EB", border: "none", borderRadius: "10px",
                  color: "#FFFFFF", fontSize: "13px", fontWeight: "600", cursor: "pointer"
                }}>
                  Nouvelle demande
                </button>
              )}
              {direction.statut === "en_attente" && (
                <button onClick={handleReset} style={{
                  width: "100%", marginTop: "14px", padding: "10px",
                  background: "#6B7280", border: "none", borderRadius: "10px",
                  color: "#FFFFFF", fontSize: "13px", fontWeight: "600", cursor: "pointer"
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