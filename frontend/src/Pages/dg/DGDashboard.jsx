import { useState, useEffect } from "react"
import DGSidebar from "../../component/dg/Dgsidebar"
import StatCard  from "../../component/dg/Statcard"
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
    <div className="min-h-screen bg-bg-global text-text-primary flex">
      <DGSidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-tertiary">Chargement...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg-global text-text-primary flex">

      <DGSidebar />

      <div className="flex-1 p-6">

        {/* En-tête */}
        <h1 className="text-3xl font-bold mb-1">Tableau de bord</h1>
        <p className="text-text-secondary mb-6">Vue consolidée · Campagne 2025</p>

        {/* Cartes KPI */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard label="Budget total alloué" value={fmt(totalAlloue)} sub={`${directions.length} directions`} valueColor="accent-main" />
          <StatCard label="Total demandé" value={fmt(totalDemande)} sub="Somme des estimations" valueColor="warning" />
          <StatCard label="En attente" value={enAttente} sub="Action requise" valueColor="error" />
          <StatCard label="Traitées" value={approuvees + rejetees} sub={`${approuvees} app. · ${rejetees} rej.`} valueColor="success" />
        </div>

        {/* Tableau principal */}
        <div className="grid grid-cols-[3fr_2fr] gap-4">


          {/* Barres budget par direction */}
          <div className="bg-bg-card border border-bg-border rounded-2xl p-5">
            <h2 className="text-text-tertiary uppercase text-xs tracking-wide font-semibold mb-5">Budget demandé par direction</h2>

            {directions.map((d) => {
              const pct = d.budget && d.totalDemande ? Math.min(100, Math.round((d.totalDemande / d.budget) * 100)) : 0

              return (
                <div key={d.code} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-accent-main text-xs font-semibold">{d.code}</span>
                    <span className="text-text-tertiary text-xs">
                      {d.totalDemande ? fmt(d.totalDemande) + " / " + fmt(d.budget) : "Non soumis"}
                    </span>
                  </div>
                  <div className="bg-bg-border rounded h-1.5">
                    <div className={`h-1.5 rounded bg-accent-main transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}

            <div className="border-t border-bg-border pt-3 mt-3 flex justify-between text-xs">
              <span className="text-text-tertiary">Total demandé / alloué</span>
              <span className="text-warning font-semibold">{fmt(totalDemande)} / {fmt(totalAlloue)}</span>
            </div>
          </div>

          {/* Colonne droite : état + alertes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* État des demandes */}
            <div className="bg-bg-card border border-bg-border rounded-2xl p-5">
              <h2 className="text-text-tertiary uppercase text-xs tracking-wide font-semibold mb-4">État des demandes</h2>
              {[
                { label: "Brouillon (non soumis)", value: brouillons, color: "text-text-tertiary" },
                { label: "En attente",             value: enAttente,  color: "text-warning" },
                { label: "Approuvées",             value: approuvees, color: "text-success" },
                { label: "Rejetées",               value: rejetees,   color: "text-error" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between mb-2.5 text-sm">
                  <span className="text-text-secondary">{row.label}</span>
                  <span className={`${row.color} font-semibold`}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Alertes : demandes en attente */}
            <div className="bg-bg-card border border-bg-border rounded-2xl p-5">
              <h2 className="text-text-tertiary uppercase text-xs tracking-wide font-semibold mb-3">Alertes</h2>
              {enAttente === 0 ? (
                <p className="text-text-tertiary text-xs">Aucune alerte</p>
              ) : (
                directions.filter((d) => d.statut === "en_attente").map((d) => (
                  <div key={d.code} className="bg-warning/10 border border-warning/30 rounded-xl p-3 mb-2">
                    <p className="text-warning text-xs font-semibold mb-1">
                      {d.code} — en attente
                    </p>
                    <p className="text-text-tertiary text-xs">{fmt(d.totalDemande)}</p>
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
