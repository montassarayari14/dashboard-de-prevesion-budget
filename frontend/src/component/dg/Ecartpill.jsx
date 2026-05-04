import { useTheme } from "../../hooks/useTheme"

// Affiche l'écart en % entre montant demandé et alloué - theme-aware
export default function EcartPill({ demande, alloue }) {
  const { t, isLight } = useTheme()

  if (!demande || !alloue) return <span className={`text-slate-500 dark:text-slate-400 text-xs font-medium`}>—</span>

  const pct = Math.round(((demande - alloue) / alloue) * 100)
  const isOver = pct > 0

  const baseClass = `px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm`

  if (isOver) {
    return (
      <span className={`${baseClass} ${isLight ? t.pillDown : 'bg-red-900/60 text-red-300 border border-red-800/50'}`}>
        +{pct}%
      </span>
    )
  }

  return (
    <span className={`${baseClass} ${isLight ? t.pillUp : 'bg-emerald-900/60 text-emerald-300 border border-emerald-800/50'}`}>
      {pct}%
    </span>
  )
}
