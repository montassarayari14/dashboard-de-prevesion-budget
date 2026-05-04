import { useTheme } from "../../hooks/useTheme"

// Carte KPI theme-aware avec tokens t
export default function StatCard({ label, value, sub, valueColor = 'text-primary', color = null }) {
  const { t, isLight } = useTheme()

  const getColorClass = (colorProp) => {
    const colors = {
      kpiBlue: t.kpiBlue,
      kpiGreen: t.kpiGreen, 
      kpiRed: t.kpiRed,
      kpiAmber: t.kpiAmber,
      warning: t.warning,
      danger: t.danger
    }
    return colors[colorProp] || valueColor || t.textMain
  }

  const cardClass = isLight 
    ? 'bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl'
    : 'bg-slate-800/80 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl shadow-slate-900/30'

  return (
    <div className={`${cardClass} border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
      <p className={`${t.textSub} uppercase text-xs tracking-wide mb-2 font-semibold`}>
        {label}
      </p>
      <p className={`text-2xl font-bold mb-1 ${getColorClass(color)}`}>
        {value}
      </p>
      {sub && (
        <p className={`${t.textMute} text-xs font-medium`}>
          {sub}
        </p>
      )}
    </div>
  )
}

