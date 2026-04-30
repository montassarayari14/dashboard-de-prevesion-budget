// Badge de niveau de risque avec design moderne et effets de glow
// 🟢 FAIBLE | 🟡 MOYEN | 🔴 ÉLEVÉ

export default function RiskBadge({ niveau }) {
  const styles = {
    FAIBLE: {
      label: "FAIBLE",
      emoji: "🟢",
      bgGradient: "from-green-500/20 to-green-500/5",
      borderColor: "border-green-500/30",
      textColor: "text-green-400",
      glow: "shadow-green-500/20",
    },
    MOYEN: {
      label: "MOYEN",
      emoji: "🟡",
      bgGradient: "from-amber-500/20 to-amber-500/5",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      glow: "shadow-amber-500/20",
    },
    ELEVE: {
      label: "ÉLEVÉ",
      emoji: "🔴",
      bgGradient: "from-red-500/20 to-red-500/5",
      borderColor: "border-red-500/30",
      textColor: "text-red-400",
      glow: "shadow-red-500/20",
    },
  }

  const s = styles[niveau] || styles.MOYEN
  const className = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${s.bgGradient} ${s.borderColor} ${s.textColor} shadow-lg ${s.glow} transition-all duration-300 hover:scale-105`
  
  return (
    <span className={className}>
      <span className="relative">
        <span className="absolute inset-0 rounded-full animate-ping opacity-75"
          style={{ 
            backgroundColor: niveau === 'FAIBLE' ? '#22c55e' : niveau === 'MOYEN' ? '#f59e0b' : '#ef4444'
          }}
        ></span>
        <span className="relative">{s.emoji}</span>
      </span>
      <span>{s.label}</span>
      
      {/* Indicateur de niveau */}
      <span className="ml-1 w-1.5 h-1.5 rounded-full" 
        style={{ 
          backgroundColor: niveau === 'FAIBLE' ? '#22c55e' : niveau === 'MOYEN' ? '#f59e0b' : '#ef4444'
        }}
      ></span>
    </span>
  )
}
