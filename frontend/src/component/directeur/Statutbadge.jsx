import { useTheme } from "../../hooks/useTheme"

export default function StatutBadge({ statut }) {
  const { t } = useTheme()

  const config = {
    brouillon:  { classes: t.badgeBrouillon, label: "Brouillon"       },
    en_attente: { classes: t.badgeAttente,   label: "Soumis à la DG"  },
    approuve:   { classes: t.badgeApprouve,  label: "Approuvé"        },
    rejete:     { classes: t.badgeRejete,    label: "Rejeté"          },
  }

  const c = config[statut] || config.brouillon

  return (
    <span className={`${c.classes} px-[10px] py-[3px] rounded-full text-[11px] font-semibold`}>
      {c.label}
    </span>
  )
}