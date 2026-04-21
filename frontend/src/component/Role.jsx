import RoleItem from "./RoleItem"

export default function Roles({ users }) {

  const total = users.length

  // calcul des rôles
  const admins = users.filter(u => u.role == "Admin").length
  const directeurs = users.filter(u => u.role == "Directeur").length
  const generals = users.filter(u => u.role == "Directeur Generale").length

  
  const calcul = (value) => {
    if (total == 0) return 0
    return Math.round((value / total) * 100)
  }

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        Répartition des rôles
      </h2>

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