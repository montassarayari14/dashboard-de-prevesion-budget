import { useState, useEffect } from "react"
import DGSidebar from "../../component/dg/Dgsidebar"
import StatCard  from "../../component/dg/Statcard"
import { useTheme } from "../../hooks/useTheme"
import API       from "../../api/axios"

export default function DGStatistiques() {
  const [directions, setDirections] = useState([])
  const { isLight, t } = useTheme()

  useEffect(() => {
    API.get("/directions").then((res) => setDirections(res.data))
  }, [])

  const totalAlloue  = directions.reduce((s, d) => s + (d.budget || 0), 0)
  const totalDemande = directions.reduce((s, d) => s + (d.totalDemande || 0), 0)
  const tauxGlobal   = totalAlloue > 0 ? Math.round((totalDemande / totalAlloue) * 100) : 0

  const catColors = {
    "Informatique":   t.barInfo,
    "RH / Formation": t.barRH,
    "Infrastructure": t.barInfra,
    "Général":        t.barGen,
    "Autre":          t.barAutre,
  }

  return (
    <div className={`min-h-screen ${t.pageBg} flex`}>

      <DGSidebar />

      <div className="flex-1 p-8">

        {/* En-tête */}
        <div className="mb-8">
          <h1 className={`text-[26px] font-bold mb-2 ${t.textMain}`}>Statistiques</h1>
          <p className={`${t.textSub} text-[14px]`}>Comparaison inter-directions · 2025 vs 2024</p>
        </div>

        {/* Cartes KPI */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-5`}>
            <p className={`${t.textSub} text-[11px] uppercase tracking-wide mb-3`}>Enveloppe totale 2025</p>
            <p className={`${t.kpiBlue} text-[22px] font-bold leading-none`}>{Math.round(totalAlloue / 1000)}K DT</p>
            <p className={t.textSub}>{directions.length} directions</p>
          </div>
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-5`}>
            <p className={`${t.textSub} text-[11px] uppercase tracking-wide mb-3`}>Total demandé</p>
            <p className={`${t.kpiAmber} text-[22px] font-bold leading-none`}>{Math.round(totalDemande / 1000)}K DT</p>
            <p className={t.textSub}>Somme estimations</p>
          </div>
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-5`}>
            <p className={`${t.textSub} text-[11px] uppercase tracking-wide mb-3`}>Taux d'utilisation</p>
            <p className={`text-[22px] font-bold leading-none ${tauxGlobal > 100 ? "text-red-500" : t.kpiGreen}`}>{tauxGlobal}%</p>
            <p className={t.textSub}>Des enveloppes allouées</p>
          </div>
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-5`}>
            <p className={`${t.textSub} text-[11px] uppercase tracking-wide mb-3`}>vs Budget 2024</p>
            <p className={t.kpiBlue}>+12%</p>
            <p className={t.textSub}>Hausse globale estimée</p>
          </div>
        </div>

        {/* Grille graphiques */}
        <div className="grid grid-cols-2 gap-5 mb-5">

          {/* Comparaison N vs N-1 */}
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
            <h2 className={`${t.textMain} text-[15px] font-semibold mb-5`}>Budget 2025 vs 2024</h2>

            {directions.map((d) => {
              const pct2025 = d.budget && d.totalDemande ? Math.min(100, Math.round((d.totalDemande / d.budget) * 100)) : 0
              const pct2024 = d.budgetN1 && d.totalDemandeN1 ? Math.round((d.totalDemandeN1 / d.budgetN1) * 100) : 0
              const delta   = d.totalDemande && d.totalDemandeN1
                ? Math.round(((d.totalDemande - d.totalDemandeN1) / d.totalDemandeN1) * 100)
                : null

              return (
                <div key={d.code} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-3">
                    <span className={`${t.kpiBlue} text-[13px] font-semibold`}>{d.code}</span>
                    <div className="flex-1">
                      {/* Barre N-1 */}
                      <p className={`${t.textSub} text-[12px] mb-1`}>
                        2024 — {d.totalDemandeN1 ? `${Math.round(d.totalDemandeN1 / 1000)}K` : "—"}
                      </p>
                      <div className={`${t.trackBg} rounded-[3px] h-[5px] mb-3`}>
                        <div className="h-[5px] rounded-[3px]" style={{ width: `${pct2024}%`, background: t.barN1 }} />
                      </div>
                      {/* Barre N */}
                      <p className={`${t.kpiBlue} text-[12px] mb-1`}>
                        2025 — {d.totalDemande ? `${Math.round(d.totalDemande / 1000)}K` : "Non soumis"}
                      </p>
                      <div className={`${t.trackBg} rounded-[3px] h-[5px]`}>
                        <div className="h-[5px] rounded-[3px]" style={{ width: `${pct2025}%`, background: t.barInfo }} />
                      </div>
                    </div>
                    {/* Badge écart */}
                    <span className={`
                      px-[6px] py-1 rounded-md text-[11px] font-semibold w-[42px] text-center
                      ${delta === null 
                        ? t.textSub 
                        : delta > 0 
                          ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                      }`}>
                      {delta !== null ? `${delta > 0 ? "+" : ""}${delta}%` : "—"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Colonne droite */}
          <div className="space-y-5">

            {/* Répartition enveloppe */}
            <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
              <h2 className={`${t.textMain} text-[15px] font-semibold mb-4`}>Répartition de l'enveloppe</h2>
              {directions.map((d) => {
                const pct = totalAlloue > 0 ? Math.round((d.budget / totalAlloue) * 100) : 0
                return (
                  <div key={d.code} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-[13px] mb-1">
                      <span className={t.textSub}>{d.code}</span>
                      <span className={`font-mono font-medium ${t.kpiBlue}`}>
                        {pct}% · {d.budget?.toLocaleString("fr-FR")} DT
                      </span>
                    </div>
                    <div className={`${t.trackBg} rounded-[3px] h-[5px]`}>
                      <div className="h-[5px] rounded-[3px]" style={{ width: `${pct}%`, background: t.barInfo }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Taux d'utilisation par direction */}
            <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
              <h2 className={`${t.textMain} text-[15px] font-semibold mb-4`}>Taux d'utilisation</h2>
              {directions.map((d) => {
                const pct = d.budget && d.totalDemande ? Math.min(100, Math.round((d.totalDemande / d.budget) * 100)) : 0
                return (
                  <div key={d.code} className="flex items-center gap-3 mb-3 last:mb-0">
                    <span className={`${t.textSub} text-[13px]`}>{d.code}</span>
                    <div className="flex-1">
                      <div className={`${t.trackBg} rounded-[3px] h-[5px]`}>
                        <div className="h-[5px] rounded-[3px]" style={{ width: `${pct}%`, background: t.barInfo }} />
                      </div>
                    </div>
                    <span className={`${t.kpiBlue} text-[13px] font-semibold w-[36px] text-right`}>
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
