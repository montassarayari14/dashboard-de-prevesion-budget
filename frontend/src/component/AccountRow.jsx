export default function AccountRow({ user, onDelete, onToggle }) {

  const roleColor = {
    "Admin": "bg-blue-500/20 text-blue-400",
    "Directeur": "bg-yellow-500/20 text-yellow-400",
    "Directeur Generale": "bg-purple-500/20 text-purple-400",
  }

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/30">

      <td className="py-4 pl-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
            {user.prenom?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm">{user.prenom} {user.nom}</span>
        </div>
      </td>

      <td className="py-4 text-sm text-slate-400">{user.email}</td>

      <td className="py-4">
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${roleColor[user.role] || "bg-slate-700 text-slate-300"}`}>
          {user.role}
        </span>
      </td>

      <td className="py-4 text-sm text-slate-400">{user.direction}</td>

      <td className="py-4">
        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit
          ${user.status == "actif" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${user.status == "actif" ? "bg-green-400" : "bg-red-400"}`} />
          {user.status}
        </span>
      </td>

      <td className="py-4 text-sm text-slate-400">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>

      <td className="py-4">
        <div className="flex gap-2">

          <button
            onClick={() => onToggle(user._id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium
              ${user.status == "actif"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-green-500/20 text-green-400"
              }`}
          >
            {user.status == "actif" ? "Désactiver" : "Activer"}
          </button>

          {user.role != "Admin" && (
            <button
              onClick={() => onDelete(user._id)}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400"
            >
              Supprimer
            </button>
          )}

        </div>
      </td>

    </tr>
  )
}