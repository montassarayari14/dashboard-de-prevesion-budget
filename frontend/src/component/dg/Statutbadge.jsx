// Badge coloré selon le statut de la demande
const styles = {
  brouillon:  { background: "#1e293b", color: "#94a3b8" },
  en_attente: { background: "#451a03", color: "#fbbf24" },
  approuve:   { background: "#052e16", color: "#4ade80" },
  rejete:     { background: "#450a0a", color: "#f87171" },
}

const labels = {
  brouillon:  "Brouillon",
  en_attente: "En attente",
  approuve:   "Approuvé",
  rejete:     "Rejeté",
}

export default function StatutBadge({ statut }) {
  const style = styles[statut] || styles.brouillon
  return (
    <span style={{
      ...style,
      padding: "3px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: "600",
    }}>
      {labels[statut] || statut}
    </span>
  )
}