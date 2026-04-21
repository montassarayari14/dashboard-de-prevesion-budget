import { useState, useEffect } from "react"
import DGSidebar from "../../component/dg/DGSidebar"
import StatCard  from "../../component/dg/StatCard"
import API       from "../../api/axios"

export default function DGStatistiques() {
  const [directions, setDirections] = useState([])

  useEffect(() => {
    API.get("/directions").then((res) => setDirections(res.data))
  }, [])

  const totalAlloue  = directions.reduce((s, d) => s + (d.budget || 0), 0)
  const totalDemande = directions.reduce((s, d) => s + (d.totalDemande || 0), 0)
  const tauxGlobal   = totalAlloue > 0 ? Math.round((totalDemande / totalAlloue) * 100) : 0

  return (
    <div style={{ minHeight: "100vh", background: "#050b1a", color: "#ffffff", display: "flex" }}>
      <DGSidebar />

      <div style={{ flex: 1, padding: "24px" }}>

        {/* En-tête */}
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0" }}>Statistiques</h1>
        <p style={{ color: "#64748b", margin: "0 0 24px 0" }}>Comparaison inter-directions · 2025 vs 2024</p>

        {/* Cartes KPI */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
          <StatCard label="Enveloppe totale 2025" value={`${Math.round(totalAlloue / 1000)}K DT`} sub={`${directions.length} directions`} valueColor="#818cf8" />
          <StatCard label="Total demandé" value={`${Math.round(totalDemande / 1000)}K DT`} valueColor="#fbbf24" />
          <StatCard label="Taux d'utilisation" value={`${tauxGlobal}%`} sub="Des enveloppes allouées" valueColor="#4ade80" />
          <StatCard label="vs Budget 2024" value="+12%" sub="Hausse globale estimée" valueColor="#a78bfa" />
        </div>

        {/* Grille graphiques */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* Comparaison N vs N-1 */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 20px 0" }}>Budget 2025 vs 2024</h2>

            {directions.map((d) => {
              const pct2025 = d.budget && d.totalDemande ? Math.round((d.totalDemande / d.budget) * 100) : 0
              const pct2024 = d.budgetN1 && d.totalDemandeN1 ? Math.round((d.totalDemandeN1 / d.budgetN1) * 100) : 0
              const delta   = d.totalDemande && d.totalDemandeN1
                ? Math.round(((d.totalDemande - d.totalDemandeN1) / d.totalDemandeN1) * 100)
                : null

              return (
                <div key={d.code} style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#818cf8", fontSize: "11px", fontWeight: "700", width: "36px" }}>{d.code}</span>
                    <div style={{ flex: 1 }}>
                      {/* Barre N-1 */}
                      <p style={{ color: "#475569", fontSize: "10px", margin: "0 0 2px 0" }}>
                        2024 — {d.totalDemandeN1 ? `${Math.round(d.totalDemandeN1 / 1000)}K` : "—"}
                      </p>
                      <div style={{ background: "#1e293b", borderRadius: "3px", height: "5px", marginBottom: "6px" }}>
                        <div style={{ width: `${pct2024}%`, height: "5px", borderRadius: "3px", background: "#334155" }} />
                      </div>
                      {/* Barre N */}
                      <p style={{ color: "#818cf8", fontSize: "10px", margin: "0 0 2px 0" }}>
                        2025 — {d.totalDemande ? `${Math.round(d.totalDemande / 1000)}K` : "Non soumis"}
                      </p>
                      <div style={{ background: "#1e293b", borderRadius: "3px", height: "5px" }}>
                        <div style={{ width: `${pct2025}%`, height: "5px", borderRadius: "3px", background: "#6366f1" }} />
                      </div>
                    </div>
                    {/* Badge écart */}
                    <span style={{
                      padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "600", width: "40px", textAlign: "center",
                      background: delta === null ? "#1e293b" : delta > 0 ? "#450a0a" : "#052e16",
                      color: delta === null ? "#475569" : delta > 0 ? "#f87171" : "#4ade80"
                    }}>
                      {delta !== null ? `${delta > 0 ? "+" : ""}${delta}%` : "—"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Colonne droite */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Répartition enveloppe */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 16px 0" }}>Répartition de l'enveloppe</h2>
              {directions.map((d) => {
                const pct = totalAlloue > 0 ? Math.round((d.budget / totalAlloue) * 100) : 0
                return (
                  <div key={d.code} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ color: "#94a3b8" }}>{d.code}</span>
                      <span style={{ color: "#818cf8", fontFamily: "monospace" }}>{pct}% · {d.budget?.toLocaleString("fr-FR")} DT</span>
                    </div>
                    <div style={{ background: "#1e293b", borderRadius: "3px", height: "5px" }}>
                      <div style={{ width: `${pct}%`, height: "5px", borderRadius: "3px", background: "#6366f1" }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Taux d'utilisation par direction */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 16px 0" }}>Taux d'utilisation</h2>
              {directions.map((d) => {
                const pct = d.budget && d.totalDemande ? Math.round((d.totalDemande / d.budget) * 100) : 0
                return (
                  <div key={d.code} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ color: "#94a3b8", fontSize: "12px", width: "36px" }}>{d.code}</span>
                    <div style={{ flex: 1, background: "#1e293b", borderRadius: "3px", height: "5px" }}>
                      <div style={{ width: `${pct}%`, height: "5px", borderRadius: "3px", background: "#6366f1" }} />
                    </div>
                    <span style={{ color: pct > 0 ? "#818cf8" : "#334155", fontSize: "12px", fontWeight: "600", width: "32px", textAlign: "right" }}>
                      {pct > 0 ? `${pct}%` : "—"}
                    </span>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}