// Métriques quantitatives du budget avec design moderne et visualisations détaillées
// Affiché dans le panneau IA

import { useEffect, useState } from "react"

export default function BudgetAnalysisMetrics({ analyse }) {
  const [animated, setAnimated] = useState(false)
  
  useEffect(() => {
    setAnimated(true)
  }, [])

  if (!analyse) return null

  // Extraire les valeurs avec gestion des valeurs manquantes
  const budgetAlloue = analyse.budgetAlloue || 0
  const budgetDemande = analyse.budgetDemande || 0
  
  // Calculer les valeurs dérivées
  const tauxConsommation = budgetAlloue > 0 
    ? Math.round((budgetDemande / budgetAlloue) * 100) 
    : 0
  const margeDisponible = budgetAlloue - budgetDemande
  const budgetN1 = analyse.budgetN1 || null
  const totalDemandeN1 = analyse.totalDemandeN1 || null

  // Calculer le pourcentage pour les barres de progression
  const tauxBar = Math.min(100, Math.max(0, tauxConsommation))
  const margeBar = budgetAlloue > 0 ? Math.min(100, Math.max(0, (margeDisponible / budgetAlloue) * 100)) : 50

  const items = [
    {
      label: "Budget alloué",
      value: budgetAlloue ? budgetAlloue.toLocaleString("fr-FR") + " DT" : "—",
      color: "#818cf8",
      icon: "💰",
      bgGradient: "from-indigo-500/20 to-purple-500/10",
      borderColor: "border-indigo-500/30",
    },
    {
      label: "Demande soumise",
      value: budgetDemande ? budgetDemande.toLocaleString("fr-FR") + " DT" : "—",
      color: "#fbbf24",
      icon: "📋",
      bgGradient: "from-amber-500/20 to-orange-500/10",
      borderColor: "border-amber-500/30",
    },
    {
      label: "Taux de consommation",
      value: tauxConsommation + "%",
      color: tauxConsommation > 90 ? "#f87171" : tauxConsommation > 75 ? "#fbbf24" : "#4ade80",
      icon: "📊",
      alert: tauxConsommation > 90,
      bgGradient: tauxConsommation > 90 
        ? "from-red-500/20 to-red-500/5" 
        : tauxConsommation > 75 
          ? "from-amber-500/20 to-amber-500/5"
          : "from-green-500/20 to-green-500/5",
      borderColor: tauxConsommation > 90 
        ? "border-red-500/30" 
        : tauxConsommation > 75 
          ? "border-amber-500/30"
          : "border-green-500/30",
    },
    {
      label: "Marge disponible",
      value: margeDisponible >= 0
        ? margeDisponible.toLocaleString("fr-FR") + " DT"
        : "Dépassement: " + Math.abs(margeDisponible).toLocaleString("fr-FR") + " DT",
      color: margeDisponible >= 0 ? "#4ade80" : "#f87171",
      icon: margeDisponible >= 0 ? "✅" : "⚠️",
      alert: margeDisponible < 0,
      bgGradient: margeDisponible >= 0 
        ? "from-green-500/20 to-green-500/5" 
        : "from-red-500/20 to-red-500/5",
      borderColor: margeDisponible >= 0 
        ? "border-green-500/30" 
        : "border-red-500/30",
    },
  ]

  // Ajouter comparaison N-1 si disponible
  if (budgetN1 && totalDemandeN1) {
const ecart = Math.round(((budgetDemande - totalDemandeN1) / totalDemandeN1) * 100)
    items.push({
      label: "Écart vs N-1",
      value: `${ecart > 0 ? '+' : ''}${ecart}%`,
      color: Math.abs(ecart) > 30 ? "#f87171" : "#94a3b8",
      icon: "📈",
      alert: Math.abs(ecart) > 30,
      bgGradient: Math.abs(ecart) > 30 
        ? "from-red-500/20 to-red-500/5" 
        : "from-blue-500/20 to-blue-500/5",
      borderColor: Math.abs(ecart) > 30 
        ? "border-red-500/30" 
        : "border-blue-500/30",
    })
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={`relative bg-gradient-to-br ${item.bgGradient} ${item.borderColor} border rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </span>
            {item.alert && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </div>
          
          <p
            className="text-lg font-bold mb-3"
            style={{ color: item.color }}
          >
            {item.value}
          </p>
          
          {/* Barre de progression visuelle */}
          {(i === 2 || i === 3) && (
            <div className="mt-2">
              <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: animated ? `${i === 2 ? tauxBar : Math.abs(margeBar)}%` : '0%',
                    background: `linear-gradient(90deg, ${item.color}80, ${item.color})`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Carte résumé visuelle additionnelle */}
      {budgetAlloue && budgetDemande && (
        <div className="col-span-2 mt-2 bg-gradient-to-r from-slate-800/50 via-slate-700/30 to-slate-800/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Alloué</p>
              <p className="text-indigo-400 text-sm font-bold">{budgetAlloue.toLocaleString("fr-FR")}</p>
            </div>
            
            {/* Indicateur visuel */}
            <div className="flex flex-col items-center px-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke={tauxConsommation > 90 ? "#ef4444" : tauxConsommation > 75 ? "#f59e0b" : "#22c55e"}
                    strokeWidth="4"
                    strokeDasharray={176}
                    strokeDashoffset={176 - (176 * Math.min(100, tauxConsommation) / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-bold ${
                    tauxConsommation > 90 ? 'text-red-400' : tauxConsommation > 75 ? 'text-amber-400' : 'text-green-400'
                  }`}>
                    {tauxConsommation}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center flex-1">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Demandé</p>
              <p className="text-amber-400 text-sm font-bold">{budgetDemande.toLocaleString("fr-FR")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
