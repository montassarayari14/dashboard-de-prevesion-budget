// Métriques budget IA – Design amélioré bijoux / Stat cards optimisées

import { useEffect, useState } from "react"
import { useTheme } from "../../hooks/useTheme"

export default function BudgetAnalysisMetrics({ analyse }) {
  const { isDark } = useTheme()
  const [animated, setAnimated] = useState(false)
  
  useEffect(() => {
    setAnimated(true)
  }, [analyse])

  if (!analyse) return null

  const budgetDemande = analyse.totalDemande || 0
  const budgetAlloue = analyse.budgetAlloue || 0
  const tauxConsommation = budgetAlloue > 0 ? Math.round((budgetDemande / budgetAlloue) * 100) : 0
  const margeDisponible = budgetAlloue - budgetDemande
  const budgetN1 = analyse.budgetN1 || 0
  const totalDemandeN1 = analyse.totalDemandeN1 || 0

  const tauxBar = Math.min(100, Math.max(0, tauxConsommation))
  const margeBar = budgetAlloue > 0 ? Math.min(100, Math.max(0, (margeDisponible / budgetAlloue) * 100)) : 50

  const items = [
    {
      label: "Budget alloué",
      value: budgetAlloue ? budgetAlloue.toLocaleString("fr-FR") + " DT" : "—",
      color: "accent-main",
      icon: "Budget",
    },
    {
      label: "Demande soumise",
      value: budgetDemande ? budgetDemande.toLocaleString("fr-FR") + " DT" : "—",
      color: "warning",
      icon: "Demandé",
    },
    {
      label: "Taux de consommation",
      value: tauxConsommation + "%",
      color: tauxConsommation > 90 ? "error" : tauxConsommation > 75 ? "warning" : "success",
      icon: "Consommation",
      alert: tauxConsommation > 90,
    },
    {
      label: "Marge disponible",
      value: margeDisponible >= 0
        ? margeDisponible.toLocaleString("fr-FR") + " DT"
        : "Dépassement: " + Math.abs(margeDisponible).toLocaleString("fr-FR") + " DT",
      color: margeDisponible >= 0 ? "success" : "error",
      icon: margeDisponible >= 0 ? "Disponible" : "Dépassement",
      alert: margeDisponible < 0,
    },
  ]

  if (budgetN1 && totalDemandeN1) {
    const ecart = Math.round(((budgetDemande - totalDemandeN1) / totalDemandeN1) * 100)
    items.push({
      label: "Écart vs N-1",
      value: `${ecart > 0 ? '+' : ''}${ecart}%`,
      color: Math.abs(ecart) > 30 ? "error" : "text-secondary",
      icon: "Écart",
      alert: Math.abs(ecart) > 30,
    })
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={`relative bg-bg-card/50 border border-bg-border rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10 ${
            item.alert ? 'ring-2 ring-accent-main/20' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </span>
            {item.alert && (
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span>
            )}
          </div>
          
          <p className={`text-lg font-bold mb-3 ${item.color}`}>
            {item.value}
          </p>
          
          {/* Barre progression */}
          {(i === 2 || i === 3) && (
            <div className="mt-2">
              <div className="h-2 bg-bg-border/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${item.color}`}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Carte résumé */}
      {budgetAlloue && budgetDemande && (
        <div className="col-span-2 mt-2 bg-bg-card/70 border border-bg-border/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Alloué</p>
              <p className="text-accent-main text-sm font-bold">{budgetAlloue.toLocaleString("fr-FR")}</p>
            </div>
            
            <div className="flex flex-col items-center px-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="hsl(var(--bg-border))"
                    strokeWidth="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    strokeWidth="4"
                    strokeDasharray="176"
                    strokeDashoffset={176 - (176 * Math.min(100, tauxConsommation) / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    stroke={tauxConsommation > 90 ? "hsl(var(--error))" : tauxConsommation > 75 ? "hsl(var(--warning))" : "hsl(var(--success))"}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-bold ${
                    tauxConsommation > 90 ? 'text-error' : tauxConsommation > 75 ? 'text-warning' : 'text-success'
                  }`}>
                    {tauxConsommation}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center flex-1">
              <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Demandé</p>
              <p className="text-warning text-sm font-bold">{budgetDemande.toLocaleString("fr-FR")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

