// Badge risque IA – Theme-aware
export default function RiskBadge({ niveau }) {
  const styles = {
FAIBLE: {
      label: "FAIBLE",
      indicator: "Faible",
      bgGradient: "bg-accent-main/10",
      borderColor: "border-accent-main/30",
      textColor: "text-accent-main",
      glow: "shadow-accent-main/20",
    },
    MOYEN: {
      label: "MOYEN",
      indicator: "Moyen",
      bgGradient: "bg-warning/10",
      borderColor: "border-warning/30",
      textColor: "text-warning",
      glow: "shadow-warning/20",
    },
    ELEVE: {
      label: "ÉLEVÉ",
      indicator: "Élevé",
      bgGradient: "bg-error/10",
      borderColor: "border-error/30",
      textColor: "text-error",
      glow: "shadow-error/20",
    },
  }

  const s = styles[niveau] || styles.MOYEN
  const className = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${s.bgGradient} ${s.borderColor} ${s.textColor}`

  const dotColor = niveau === 'FAIBLE' ? 'accent-main' : niveau === 'MOYEN' ? 'warning' : 'error'
  
  return (
    <span className={className}>
      <span className="relative">
        <span className={`absolute inset-0 rounded-full animate-ping opacity-75 bg-${dotColor}`} />
<span className="relative text-xs uppercase tracking-[0.25em] font-semibold">{s.indicator}</span>
      </span>
      <span>{s.label}</span>
      
      <span className={`ml-1 w-1.5 h-1.5 rounded-full bg-${dotColor}`} />
    </span>
  )
}

