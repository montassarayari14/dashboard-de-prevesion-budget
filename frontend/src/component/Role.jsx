import RoleItem from "./RoleItem"

export default function Roles({ users }) {

  const total = users.length

  // calcul des rôles
  const admins = users.filter(u => u.role == "Admin").length
  const directeurs = users.filter(u => u.role == "Directeur").length
  const generals = users.filter(u => u.role == "DG").length

  
  const calcul = (value) => {
    if (total == 0) return 0
    return Math.round((value / total) * 100)
  }

  return (
    <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6 text-[#111827]">
        Répartition des rôles
      </h2>

      <RoleItem
        title="Administrateur"
        number={admins}
        percent={`${calcul(admins)}%`}
        width={`${calcul(admins)}%`}
        color="bg-[#2563EB]"
      />

      <RoleItem
        title="Directeur"
        number={directeurs}
        percent={`${calcul(directeurs)}%`}
        width={`${calcul(directeurs)}%`}
        color="bg-[#F59E0B]"
      />

      <RoleItem
        title="Directeur Général"
        number={generals}
        percent={`${calcul(generals)}%`}
        width={`${calcul(generals)}%`}
        color="bg-[#16A34A]"
      />

    </div>
  )
}
