import { useTheme } from "../../hooks/useTheme"

export default function EcartPill({ montant, montantN1 }) {
  const { t } = useTheme()

  if (!montant || !montantN1) return <span className={t.textMute}>—</span>

  const pct  = Math.round(((montant - montantN1) / montantN1) * 100)
  const isUp = pct >= 0

  return (
    <span className={`px-2 py-[2px] rounded-md text-[11px] font-semibold ${isUp ? t.pillUp : t.pillDown}`}>
      {pct > 0 ? "+" : ""}{pct}%
    </span>
  )
}