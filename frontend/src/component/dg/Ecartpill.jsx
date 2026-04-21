// Affiche l'écart en % entre montant demandé et alloué
export default function EcartPill({ demande, alloue }) {
  if (!demande || !alloue) return <span style={{ color: "#475569", fontSize: "12px" }}>—</span>

  const pct = Math.round(((demande - alloue) / alloue) * 100)
  const isOver = pct > 0

  return (
    <span style={{
      padding: "2px 8px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: "600",
      background: isOver ? "#450a0a" : "#052e16",
      color: isOver ? "#f87171" : "#4ade80",
    }}>
      {pct > 0 ? "+" : ""}{pct}%
    </span>
  )
}