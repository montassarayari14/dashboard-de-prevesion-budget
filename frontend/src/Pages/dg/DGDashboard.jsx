import { useState, useEffect } from "react"
import DGSidebar from "../../component/dg/DGSidebar"
import StatCard  from "../../component/dg/StatCard"
import API       from "../../api/axios"

export default function DGDashboard() {
  const [directions, setDirections] = useState([])
  const [loading, setLoading] = useState(true)

  // Charge les directions depuis le backend
  useEffect(() => {
    API.get("/directions")
      .then((res) => setDirections(res.data))
      .finally(() => setLoading(false))
  }, [])

  // Calculs globaux
  const totalAlloue  = directions.reduce((s, d) => s + (d.budget || 0), 0)
  const totalDemande = directions.reduce((s, d) => s + (d.totalDemande || 0), 0)
  const enAttente    = directions.filter((d) => d.statut === "en_attente").length
  const approuvees   = directions.filter((d) => d.statut === "approuve").length
  const rejetees     = directions.filter((d) => d.statut === "rejete").length
  const brouillons   = directions.filter((d) => d.statut === "brouillon").length

  // Formate un nombre en DT
  function fmt(n) {
    if (!n) return "—"
    return n.toLocaleString("fr-FR") + " DT"
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050b1a", display: "flex" }}>
      <DGSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#475569" }}>Chargement...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#050b1a", color: "#ffffff", display: "flex" }}>
      <DGSidebar />

      <div style={{ flex: 1, padding: "24px" }}>

        {/* En-tête */}
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0" }}>Tableau de bord</h1>
        <p style={{ color: "#64748b", margin: "0 0 24px 0" }}>Vue consolidée · Campagne 2025</p>

        {/* Cartes KPI */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
          <StatCard label="Budget total alloué" value={fmt(totalAlloue)} sub={`${directions.length} directions`} valueColor="#818cf8" />
          <StatCard label="Total demandé" value={fmt(totalDemande)} sub="Somme des estimations" valueColor="#fbbf24" />
          <StatCard label="En attente" value={enAttente} sub="Action requise" valueColor="#f87171" />
          <StatCard label="Traitées" value={approuvees + rejetees} sub={`${approuvees} app. · ${rejetees} rej.`} valueColor="#4ade80" />
        </div>

        {/* Tableau principal */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "16px" }}>

          {/* Barres budget par direction */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 20px 0" }}>Budget demandé par direction</h2>

            {directions.map((d) => {
              const pct = d.budget && d.totalDemande ? Math.round((d.totalDemande / d.budget) * 100) : 0
              return (
                <div key={d.code} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#818cf8", fontSize: "12px", fontWeight: "600" }}>{d.code}</span>
                    <span style={{ color: "#64748b", fontSize: "11px" }}>
                      {d.totalDemande ? fmt(d.totalDemande) + " / " + fmt(d.budget) : "Non soumis"}
                    </span>
                  </div>
                  <div style={{ background: "#1e293b", borderRadius: "4px", height: "6px" }}>
                    <div style={{ width: `${pct}%`, height: "6px", borderRadius: "4px", background: "#6366f1" }} />
                  </div>
                </div>
              )
            })}

            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "12px", marginTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: "#64748b" }}>Total demandé / alloué</span>
              <span style={{ color: "#fbbf24", fontWeight: "600" }}>{fmt(totalDemande)} / {fmt(totalAlloue)}</span>
            </div>
          </div>

          {/* Colonne droite : état + alertes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* État des demandes */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 16px 0" }}>État des demandes</h2>
              {[
                { label: "Brouillon (non soumis)", value: brouillons, color: "#64748b" },
                { label: "En attente",             value: enAttente,  color: "#fbbf24" },
                { label: "Approuvées",             value: approuvees, color: "#4ade80" },
                { label: "Rejetées",               value: rejetees,   color: "#f87171" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px" }}>
                  <span style={{ color: "#94a3b8" }}>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: "600" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Alertes : demandes en attente */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 12px 0" }}>Alertes</h2>
              {enAttente === 0 ? (
                <p style={{ color: "#475569", fontSize: "12px" }}>Aucune alerte</p>
              ) : (
                directions.filter((d) => d.statut === "en_attente").map((d) => (
                  <div key={d.code} style={{
                    background: "#1c1300", border: "1px solid #451a03",
                    borderRadius: "10px", padding: "10px 12px", marginBottom: "8px"
                  }}>
                    <p style={{ color: "#fbbf24", fontSize: "12px", fontWeight: "600", margin: "0 0 2px 0" }}>
                      {d.code} — en attente
                    </p>
                    <p style={{ color: "#78716c", fontSize: "11px", margin: 0 }}>{fmt(d.totalDemande)}</p>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}