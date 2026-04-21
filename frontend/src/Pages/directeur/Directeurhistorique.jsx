import { useState, useEffect } from "react"
import DirecteurSidebar from "../../component/directeur/DirecteurSidebar"
import StatutBadge from "../../component/directeur/StatutBadge"
import EcartPill from "../../component/directeur/EcartPill"
import API from "../../api/axios"

export default function DirecteurHistorique() {
  const [historique, setHistorique] = useState([])
  const [loading, setLoading]       = useState(true)
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    // Historique filtré pour la direction de l'utilisateur connecté
    API.get(`/directions/historique?code=${user.direction}`)
      .then((res) => setHistorique(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#050b1a", color: "#fff", display: "flex" }}>
      <DirecteurSidebar />

      <div style={{ flex: 1, padding: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0" }}>Historique des demandes</h1>
        <p style={{ color: "#64748b", margin: "0 0 24px 0" }}>
          Toutes les campagnes budgétaires · Direction {user.direction}
        </p>

        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Campagne", "Total demandé", "Budget alloué", "Écart", "Statut", "Soumis le", "Traité le", "Commentaire DG"].map((th) => (
                  <th key={th} style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#475569" }}>Chargement...</td>
                </tr>
              ) : historique.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#475569" }}>
                    Aucun historique disponible
                  </td>
                </tr>
              ) : (
                historique.map((h, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "12px 16px", color: "#fff", fontWeight: "700", fontFamily: "monospace" }}>{h.annee}</td>
                    <td style={{ padding: "12px 16px", color: "#fbbf24", fontFamily: "monospace", fontSize: "13px" }}>
                      {h.totalDemande ? `${h.totalDemande.toLocaleString("fr-FR")} DT` : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b", fontFamily: "monospace", fontSize: "13px" }}>
                      {h.budget ? `${h.budget.toLocaleString("fr-FR")} DT` : "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <EcartPill montant={h.totalDemande} montantN1={h.budget} />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <StatutBadge statut={h.statut} />
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b", fontFamily: "monospace", fontSize: "12px" }}>
                      {h.decisionLe ? new Date(h.decisionLe).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b", fontFamily: "monospace", fontSize: "12px" }}>
                      {h.decisionLe ? new Date(h.decisionLe).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "12px", maxWidth: "200px" }}>
                      {h.commentaireDG || <span style={{ color: "#334155" }}>—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}