// Affiche l'écart en % entre montant N et N-1
export default function EcartPill({ montant, montantN1 }) {
  if (!montant || !montantN1) return <span style={{ color: "#475569" }}>—</span>
  const pct = Math.round(((montant - montantN1) / montantN1) * 100)
  const isUp = pct >= 0
  return (
    <span style={{
      padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "600",
      background: isUp ? "#052e16" : "#450a0a",
      color:      isUp ? "#4ade80" : "#f87171",
    }}>
      {pct > 0 ? "+" : ""}{pct}%
    </span>
  )
}