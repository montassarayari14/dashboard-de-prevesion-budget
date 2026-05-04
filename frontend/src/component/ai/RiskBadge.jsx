import { useTheme } from "../../hooks/useTheme"

// Badge risque IA – Theme-aware avec tokens t
export default function RiskBadge({ niveau }) {
  const { t, isLight } = useTheme()

  const styles = {
    FAIBLE: {
      label: "FAIBLE",
      indicator: "Faible",
      light: {
        bg: "bg-emerald-100/80", 
        border: "border-emerald-200", 
        text: t.success,
        dot: "bg-emerald-500"
      },
      dark: {
        bg: "bg-emerald-900/50", 
        border: "border-emerald-800/50", 
        text: t.success,
        dot: "bg-emerald-400"
      }
    },
    MOYEN: {
      label: "MOYEN",
      indicator: "Moyen",
      light: {
        bg: "bg-orange-100/80", 
        border: "border-orange-200", 
        text: t.warning,
        dot: "bg-orange-500"
      },
      dark: {
        bg: "bg-orange-900/50", 
        border: "border-orange-800/50", 
        text: t.warning,
        dot: "bg-orange-400"
      }
    },
    ELEVE: {
      label: "ÉLEVÉ",
      indicator: "Élevé",
      light: {
        bg: "bg-red-100/80", 
        border: "border-red-200", 
        text: t.danger,
        dot: "bg-red-500"
      },
      dark: {
        bg: "bg-red-900/50", 
        border: "border-red-800/50", 
        text: t.danger,
        dot: "bg-red-400"
      }
    }
  }

  const s = styles[niveau] || styles.MOYEN
  const themeStyles = isLight ? s.light : s.dark
  
  const className = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border font-semibold shadow-sm ${themeStyles.bg} ${themeStyles.border} ${themeStyles.text}`

  return (
    <span className={className}>
      <span className="relative flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${themeStyles.dot} animate-ping absolute opacity-75`} />
        <span className="relative text-xs uppercase tracking-[0.2em] font-bold">{s.indicator}</span>
      </span>
      <span className="tracking-wide">{s.label}</span>
      <span className={`ml-1 w-2 h-2 rounded-full ${themeStyles.dot}`} />
    </span>
  )
}

