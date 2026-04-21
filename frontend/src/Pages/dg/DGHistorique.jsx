import { useState, useEffect } from "react"
import DGSidebar   from "../../component/dg/DGSidebar"
import StatutBadge from "../../component/dg/StatutBadge"
import EcartPill   from "../../component/dg/EcartPill"
import API         from "../../api/axios"

export default function DGHistorique() {
  const [historique, setHistorique]   = useState([])
  const [anneeFiltre, setAnneeFiltre] = useState("toutes")
  const [dirFiltre, setDirFiltre]     = useState("toutes")

  useEffect(() => {
    API.get("/directions/historique").then((res) => setHistorique(res.data))
  }, [])

  // Listes uniques pour les filtres
  const annees     = ["toutes", ...new Set(historique.map((h) => h.annee))]
  const directions = ["toutes", ...new Set(historique.map((h) => h.code))]

  // Filtrage
  const filtered = historique.filter((h) => {
    const okAnnee = anneeFiltre === "toutes" || h.annee === anneeFiltre
    const okDir   = dirFiltre   === "toutes" || h.code  === dirFiltre
    return okAnnee && okDir
  })

  return (
    <div style={{ minHeight: "100vh", background: "#050b1a", color: "#ffffff", display: "flex" }}>
      <DGSidebar />

      <div style={{ flex: 1, padding: "24px" }}>

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0" }}>Historique des campagnes</h1>
            <p style={{ color: "#64748b", margin: 0 }}>Toutes les années · Toutes les directions</p>
          </div>

          {/* Filtres */}
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={anneeFiltre}
              onChange={(e) => setAnneeFiltre(e.target.value)}
              style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "8px 12px", color: "#94a3b8", fontSize: "13px", outline: "none" }}
            >
              {annees.map((a) => (
                <option key={a} value={a}>{a === "toutes" ? "Toutes les années" : a}</option>
              ))}
            </select>
            <select
              value={dirFiltre}
              onChange={(e) => setDirFiltre(e.target.value)}
              style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "8px 12px", color: "#94a3b8", fontSize: "13px", outline: "none" }}
            >
              {directions.map((d) => (
                <option key={d} value={d}>{d === "toutes" ? "Toutes les directions" : d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau historique */}
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Campagne", "Direction", "Directeur", "Demandé", "Alloué", "Écart", "Statut", "Décision le", "Commentaire"].map((th) => (
                  <th key={th} style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontSize: "11px", textTransform: "uppercase", fontWeight: "600" }}>
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: "40px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
                    Aucun historique disponible
                  </td>
                </tr>
              ) : (
                filtered.map((h, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "12px 16px", color: "#ffffff", fontWeight: "700", fontFamily: "monospace", fontSize: "13px" }}>{h.annee}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "#1e1b4b", color: "#a5b4fc", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>
                        {h.code}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "13px" }}>{h.directeur}</td>
                    <td style={{ padding: "12px 16px", color: "#fbbf24", fontFamily: "monospace", fontSize: "12px" }}>
                      {h.totalDemande?.toLocaleString("fr-FR")} DT
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b", fontFamily: "monospace", fontSize: "12px" }}>
                      {h.budget?.toLocaleString("fr-FR")} DT
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <EcartPill demande={h.totalDemande} alloue={h.budget} />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <StatutBadge statut={h.statut} />
                    </td>
                    <td style={{ padding: "12px 16px", color: "#475569", fontFamily: "monospace", fontSize: "12px" }}>
                      {h.decisionLe ? new Date(h.decisionLe).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "12px", maxWidth: "180px" }}>
                      {h.commentaireDG || "—"}
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