import { useState, useEffect } from "react"
import DGSidebar from "../../component/dg/Dgsidebar"
import StatCard  from "../../component/dg/Statcard"
import { useTheme } from "../../hooks/useTheme"
import API       from "../../api/axios"

export default function DGDashboard() {
  const [directions, setDirections] = useState([])
  const [loading, setLoading] = useState(true)
  const { isLight, t } = useTheme()

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
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <DGSidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className={t.textSub}>Chargement...</p>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${t.pageBg} flex`}>

      <DGSidebar />

      <div className="flex-1 p-8">

        {/* En-tête */}
        <div className="mb-8">
          <h1 className={`text-[26px] font-bold mb-2 ${t.textMain}`}>Tableau de bord</h1>
          <p className={`${t.textSub} text-[14px]`}>Vue consolidée · Campagne 2025</p>
        </div>

        {/* Cartes KPI */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-5`}>
            <p className={`${t.textSub} text-[11px] uppercase tracking-wide mb-3`}>Budget total alloué</p>
            <p className={`${t.kpiBlue} text-[22px] font-bold leading-none`}>{fmt(totalAlloue)}</p>
            <p className={t.textSub}>{directions.length} directions</p>
          </div>
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-5`}>
            <p className={`${t.textSub} text-[11px] uppercase tracking-wide mb-3`}>Total demandé</p>
            <p className={`${t.kpiAmber} text-[22px] font-bold leading-none`}>{fmt(totalDemande)}</p>
            <p className={t.textSub}>Somme des estimations</p>
          </div>
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-5`}>
            <p className={`${t.textSub} text-[11px] uppercase tracking-wide mb-3`}>En attente</p>
            <p className={`text-red-500 text-[22px] font-bold leading-none`}>{enAttente}</p>
            <p className={t.textSub}>Action requise</p>
          </div>
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-5`}>
            <p className={`${t.textSub} text-[11px] uppercase tracking-wide mb-3`}>Traitées</p>
            <p className={t.kpiGreen}>{approuvees + rejetees}</p>
            <p className={t.textSub}>{approuvees} app. · {rejetees} rej.</p>
          </div>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-[3fr_2fr] gap-5">

          {/* Barres budget par direction */}
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
            <h2 className={`${t.textMain} text-[15px] font-semibold mb-5`}>Budget demandé par direction</h2>

            {directions.map((d) => {
              const pct = d.budget && d.totalDemande ? Math.min(100, Math.round((d.totalDemande / d.budget) * 100)) : 0

              return (
                <div key={d.code} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`${t.textSub} text-[13px]`}>{d.code}</span>
                    <span className="font-mono text-[13px] font-medium ${t.kpiAmber}">
                      {d.totalDemande ? fmt(d.totalDemande) + " / " + fmt(d.budget) : "Non soumis"}
                    </span>
                  </div>
                  <div className={`${t.trackBg} rounded-full h-[6px]`}>
                    <div
                      className="h-[6px] rounded-full transition-all"
                      style={{ width: `${pct}%`, background: isLight ? t.barInfo : "#6366f1" }}
                    />
                  </div>
                </div>
              )
            })}

            <div className={`border-t ${t.border} mt-5 pt-4 flex justify-between items-center text-[13px]`}>
              <span className={t.textSub}>Total demandé / alloué</span>
              <span className={`font-semibold ${t.kpiAmber}`}>{fmt(totalDemande)} / {fmt(totalAlloue)}</span>
            </div>
          </div>

          {/* Colonne droite : état + alertes */}
          <div className="flex flex-col gap-5">

            {/* État des demandes */}
            <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
              <h2 className={`${t.textMain} text-[15px] font-semibold mb-4`}>État des demandes</h2>
              {[
                { label: "Brouillon (non soumis)", value: brouillons, color: t.textSub },
                { label: "En attente",             value: enAttente,  color: "text-[#D97706]" },
                { label: "Approuvées",             value: approuvees, color: t.kpiGreen },
                { label: "Rejetées",               value: rejetees,   color: "text-red-500" },
              ].map((row, i) => (
                <div key={i} className="flex justify-between mb-2.5 text-[13px]">
                  <span className={t.textSub}>{row.label}</span>
                  <span className={`${row.color} font-semibold`}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Alertes : demandes en attente */}
            <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
              <h2 className={`${t.textMain} text-[15px] font-semibold mb-4`}>Alertes</h2>
              {enAttente === 0 ? (
                <p className={`${t.textSub} text-[13px]`}>Aucune alerte</p>
              ) : (
                directions.filter((d) => d.statut === "en_attente").map((d) => (
                  <div key={d.code} className={`${t.warningBg} border ${t.warningBdr} rounded-lg p-3 mb-2`}>
                    <p className={`${t.warning} text-[13px] font-semibold mb-1`}>
                      {d.code} — en attente
                    </p>
                    <p className={`${t.textSub} text-[12px]`}>{fmt(d.totalDemande)}</p>
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
