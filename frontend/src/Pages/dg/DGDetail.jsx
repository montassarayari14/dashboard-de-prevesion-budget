import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import DGSidebar       from "../../component/dg/DGSidebar"
import StatCard        from "../../component/dg/StatCard"
import StatutBadge     from "../../component/dg/StatutBadge"
import EcartPill       from "../../component/dg/EcartPill"
import ModaleDecision  from "../../component/dg/ModaleDecision"
import AIAssistantPanel from "../../component/ai/AIAssistantPanel"
import API             from "../../api/axios"

export default function DGDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [direction, setDirection] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading]     = useState(true)
  const [erreur, setErreur]       = useState("")

  // Charge les détails de la direction
  useEffect(() => {
    API.get(`/directions/${id}`)
      .then((res) => setDirection(res.data))
      .catch(() => setErreur("Direction introuvable"))
      .finally(() => setLoading(false))
  }, [id])

  // Envoie la décision (approuver / rejeter) au backend
  async function handleDecision(dir, choix, commentaire) {
    try {
      const statut = choix === "approuver" ? "approuve" : "rejete"
      const res = await API.put(`/directions/${dir._id}/decision`, { statut, commentaire })
      setDirection(res.data)
    } catch (err) {
      alert("Erreur lors de la décision")
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050b1a", display: "flex" }}>
      <DGSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#475569" }}>Chargement...</p>
      </div>
    </div>
  )

  if (erreur || !direction) return (
    <div style={{ minHeight: "100vh", background: "#050b1a", display: "flex" }}>
      <DGSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#f87171" }}>{erreur || "Direction introuvable"}</p>
      </div>
    </div>
  )

  const marge = (direction.budget && direction.totalDemande)
    ? direction.budget - direction.totalDemande
    : null

  return (
    <div style={{ minHeight: "100vh", background: "#050b1a", color: "#ffffff", display: "flex" }}>
      <DGSidebar />

      <div style={{ flex: 1, padding: "24px" }}>

        {/* En-tête avec bouton retour */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button
            onClick={() => navigate("/dg/demandes")}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px" }}
          >
            ← Retour
          </button>
          <span style={{ color: "#334155" }}>/</span>
          <h1 style={{ fontSize: "22px", fontWeight: "700", margin: 0 }}>
            Détail — Direction {direction.code}
          </h1>
          <StatutBadge statut={direction.statut || "brouillon"} />
        </div>

        {/* Infos direction */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: "12px", padding: "16px",
          display: "flex", gap: "32px", marginBottom: "20px"
        }}>
          <div>
            <p style={{ color: "#475569", fontSize: "11px", margin: "0 0 4px 0" }}>Direction</p>
            <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600", margin: 0 }}>{direction.nom}</p>
          </div>
          <div>
            <p style={{ color: "#475569", fontSize: "11px", margin: "0 0 4px 0" }}>Directeur</p>
            <p style={{ color: "#cbd5e1", fontSize: "14px", margin: 0 }}>{direction.directeur || "Non assigné"}</p>
          </div>
          <div>
            <p style={{ color: "#475569", fontSize: "11px", margin: "0 0 4px 0" }}>Soumis le</p>
            <p style={{ color: "#cbd5e1", fontSize: "14px", fontFamily: "monospace", margin: 0 }}>
              {direction.soumisLe ? new Date(direction.soumisLe).toLocaleDateString("fr-FR") : "Non soumis"}
            </p>
          </div>
        </div>

        {/* Cartes KPI */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
          <StatCard
            label="Budget alloué"
            value={direction.budget ? direction.budget.toLocaleString("fr-FR") + " DT" : "—"}
            valueColor="#818cf8"
          />
          <StatCard
            label="Total demandé"
            value={direction.totalDemande ? direction.totalDemande.toLocaleString("fr-FR") + " DT" : "—"}
            valueColor="#fbbf24"
          />
          <StatCard
            label="Marge disponible"
            value={marge !== null ? marge.toLocaleString("fr-FR") + " DT" : "—"}
            valueColor={marge !== null && marge >= 0 ? "#4ade80" : "#f87171"}
            sub={marge !== null ? (marge >= 0 ? "Sous enveloppe" : "Dépassement !") : ""}
          />
        </div>

        {/* Tableau des postes budgétaires */}
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Poste budgétaire", "Catégorie", "Montant N", "Montant N-1", "Écart"].map((th) => (
                  <th key={th} style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontSize: "11px", textTransform: "uppercase", fontWeight: "600" }}>
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!direction.postes || direction.postes.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
                    Aucun poste budgétaire soumis
                  </td>
                </tr>
              ) : (
                direction.postes.map((p, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "12px 16px", color: "#ffffff", fontSize: "13px", fontWeight: "500" }}>{p.nom}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "#1e1b4b", color: "#a5b4fc", padding: "3px 10px", borderRadius: "6px", fontSize: "11px" }}>
                        {p.categorie}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#ffffff", fontFamily: "monospace", fontSize: "13px" }}>
                      {p.montant?.toLocaleString("fr-FR")} DT
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b", fontFamily: "monospace", fontSize: "13px" }}>
                      {p.montantN1?.toLocaleString("fr-FR")} DT
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <EcartPill demande={p.montant} alloue={p.montantN1} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

{/* Commentaire DG si déjà traité */}
        {direction.commentaireDG && (
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ color: "#475569", fontSize: "11px", margin: "0 0 6px 0" }}>Commentaire DG</p>
            <p style={{ color: "#cbd5e1", fontSize: "13px", margin: 0 }}>{direction.commentaireDG}</p>
          </div>
        )}

        {/* Assistant IA - Analyse du budget */}
        {direction.statut === "en_attente" && (
          <AIAssistantPanel direction={direction} />
        )}

        {/* Bouton décision — uniquement si en attente */}
        {direction.statut === "en_attente" && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "#4f46e5", border: "none",
                color: "#ffffff", fontWeight: "600",
                padding: "12px 24px", borderRadius: "10px",
                fontSize: "14px", cursor: "pointer"
              }}
            >
              Prendre une décision
            </button>
          </div>
        )}
      </div>

      {/* Modale de décision */}
      {showModal && (
        <ModaleDecision
          direction={direction}
          onClose={() => setShowModal(false)}
          onConfirm={handleDecision}
        />
      )}
    </div>
  )
}