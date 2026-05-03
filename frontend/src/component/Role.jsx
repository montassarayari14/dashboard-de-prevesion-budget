import { useTheme } from "../hooks/useTheme"
import RoleItem from "./RoleItem"

export default function Roles({ users }) {
  const { isLight } = useTheme()

  const total      = users.length
  const admins     = users.filter(u => u.role == "Admin").length
  const directeurs = users.filter(u => u.role == "Directeur").length
  const generals   = users.filter(u => u.role == "DG").length

  const calcul = (value) => {
    if (total == 0) return 0
    return Math.round((value / total) * 100)
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 border transition-colors duration-300 ${
      isLight
        ? "bg-white border-[#e2e7f0] shadow-sm"
        : "bg-[#0f172a] border-slate-800"
    }`}>

      {/* Déco fond */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Répartition des rôles</h2>
        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
          isLight
            ? "border-[#e2e7f0] text-[#64748b] bg-[#f7f8fc]"
            : "border-slate-700 text-slate-400 bg-slate-800/50"
        }`}>
          {total} utilisateur{total > 1 ? "s" : ""}
        </span>
      </div>

      <RoleItem
        title="Administrateur"
        number={admins}
        percent={`${calcul(admins)}%`}
        width={`${calcul(admins)}%`}
        color="bg-indigo-400"
      />
      <RoleItem
        title="Directeur"
        number={directeurs}
        percent={`${calcul(directeurs)}%`}
        width={`${calcul(directeurs)}%`}
        color="bg-yellow-400"
      />
      <RoleItem
        title="Directeur Général"
        number={generals}
        percent={`${calcul(generals)}%`}
        width={`${calcul(generals)}%`}
        color="bg-purple-400"
      />
    </div>
  )
}