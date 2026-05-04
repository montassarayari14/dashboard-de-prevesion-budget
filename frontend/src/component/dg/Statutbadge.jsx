// Badge coloré selon le statut de la demande
import { useTheme } from "../../hooks/useTheme"

export default function StatutBadge({ statut }) {
  const { t, isLight } = useTheme()

  const styles = {
    brouillon:  { light: `${t.badgeBrouillon}`, dark: 'bg-slate-800/50 text-slate-400 border border-slate-700/50' },
    en_attente: { light: `${t.badgeAttente}`, dark: 'bg-amber-900/50 text-amber-300 border border-amber-800/50' },
    approuve:   { light: `${t.badgeApprouve}`, dark: 'bg-emerald-900/50 text-emerald-300 border border-emerald-800/50' },
    rejete:     { light: `${t.badgeRejete}`, dark: 'bg-red-900/50 text-red-300 border border-red-800/50' },
  }

  const labels = {
    brouillon:  "Brouillon",
    en_attente: "En attente", 
    approuve:   "Approuvé",
    rejete:     "Rejeté",
  }

  const styleClass = isLight ? styles[statut]?.light : styles[statut]?.dark || styles.brouillon[isLight ? 'light' : 'dark']

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm ${styleClass}`}>
      {labels[statut] || statut}
    </span>
  )
}
