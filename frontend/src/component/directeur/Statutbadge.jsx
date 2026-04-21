// Badge de statut — cohérent avec l'interface DG
const config = {
  brouillon:  { bg: "#1e293b",  color: "#94a3b8", label: "Brouillon"       },
  en_attente: { bg: "#451a03",  color: "#fbbf24", label: "Soumis à la DG"  },
  approuve:   { bg: "#052e16",  color: "#4ade80", label: "Approuvé"        },
  rejete:     { bg: "#450a0a",  color: "#f87171", label: "Rejeté"          },
}

export default function StatutBadge({ statut }) {
  const c = config[statut] || config.brouillon
  return (
    <span style={{
      background: c.bg, color: c.color,
      padding: "3px 10px", borderRadius: "999px",
      fontSize: "11px", fontWeight: "600",
    }}>
      {c.label}
    </span>
  )
}