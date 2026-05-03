// Badge de statut — cohérent avec l'interface DG
const config = {
  brouillon:  { bg: "#E5E7EB",  color: "#6B7280", label: "Brouillon"       },
  en_attente: { bg: "#FEF3C7",  color: "#F59E0B", label: "Soumis à la DG"  },
  approuve:   { bg: "#DCFCE7",  color: "#16A34A", label: "Approuvé"        },
  rejete:     { bg: "#FEE2E2",  color: "#DC2626", label: "Rejeté"          },
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
