// Badge coloré selon le statut de la demande
const styles = {
  brouillon:  { background: "#E5E7EB", color: "#6B7280" },
  en_attente: { background: "#FEF3C7", color: "#F59E0B" },
  approuve:   { background: "#DCFCE7", color: "#16A34A" },
  rejete:     { background: "#FEE2E2", color: "#DC2626" },
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
