import { useTheme } from "../hooks/useTheme"

export default function AccountRow({ user, onDelete, onToggle }) {
  const { t, isLight } = useTheme()
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  const isSelf = currentUser.id === user._id  // ← l'admin connecté

  const roleColor = isLight ? {
    "Admin":              "bg-blue-100 text-blue-700",
    "Directeur":          "bg-yellow-100 text-yellow-700",
    "Directeur Generale": "bg-purple-100 text-purple-700",
    "DG":                 "bg-purple-100 text-purple-700",
  } : {
    "Admin":              "bg-blue-500/20 text-blue-400",
    "Directeur":          "bg-yellow-500/20 text-yellow-400",
    "Directeur Generale": "bg-purple-500/20 text-purple-400",
    "DG":                 "bg-purple-500/20 text-purple-400",
  }

  return (
    <tr className={`border-b transition-colors ${t.border} ${t.rowHover}`}>

      <td className="py-4 pl-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {user.prenom?.charAt(0).toUpperCase()}
          </div>
          <span className={`text-sm font-medium ${t.textMain}`}>
            {user.prenom} {user.nom}
          </span>
        </div>
      </td>

      <td className={`py-4 text-sm ${t.textSub}`}>{user.email}</td>

      <td className="py-4">
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${roleColor[user.role] || (isLight ? "bg-gray-100 text-gray-600" : "bg-slate-500/20 text-slate-400")}`}>
          {user.role}
        </span>
      </td>

      <td className={`py-4 text-sm font-mono ${t.textSub}`}>{user.direction}</td>

      <td className="py-4">
        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${
          user.status == "actif"
            ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/10 text-green-400"
            : isLight ? "bg-red-100 text-red-700"     : "bg-red-500/10 text-red-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            user.status == "actif"
              ? isLight ? "bg-green-600" : "bg-green-400"
              : isLight ? "bg-red-600"   : "bg-red-400"
          }`} />
          {user.status}
        </span>
      </td>

      <td className={`py-4 text-sm ${t.textMute}`}>
        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
      </td>

      <td className="py-4">
        <div className="flex gap-2">

          {/* Masquer Désactiver/Activer si c'est l'admin connecté lui-même */}
          {!isSelf && (
            <button
              onClick={() => onToggle(user._id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                user.status == "actif"
                  ? isLight ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                  : isLight ? "bg-green-100 text-green-700 hover:bg-green-200"   : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              }`}
            >
              {user.status == "actif" ? "Désactiver" : "Activer"}
            </button>
          )}

          {/* Masquer Supprimer si Admin OU si c'est l'admin connecté lui-même */}
          {user.role != "Admin" && !isSelf && (
            <button
              onClick={() => onDelete(user._id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                isLight
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              }`}
            >
              Supprimer
            </button>
          )}

        </div>
      </td>

    </tr>
  )
} 