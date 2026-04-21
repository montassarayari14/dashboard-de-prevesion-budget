import { Link, useLocation, useNavigate } from "react-router-dom"

// Navigation Admin — sans la page Directions (supprimée)
const navLinks = [
  { path: "/dashboard",     label: "Tableau de bord" },
  { path: "/admin/comptes", label: "Comptes"          },
  { path: "/admin/logs",    label: "Journaux d'audit" },
  { path: "/admin/parametres", label: "Paramètres"   },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="w-52 min-h-screen bg-[#0d1117] border-r border-slate-800 flex flex-col justify-between flex-shrink-0">

      {/* Haut */}
      <div>
        <div className="px-4 py-5 border-b border-slate-800">
          <p className="text-indigo-300 font-bold text-sm">Budget Admin</p>
          <p className="text-slate-600 text-xs mt-0.5">Campagne 2025</p>
        </div>

        <nav className="p-2 mt-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link key={link.path} to={link.path}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors no-underline
                  ${isActive
                    ? "bg-indigo-950 text-indigo-300 border-l-2 border-indigo-500"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border-l-2 border-transparent"
                  }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Profil + déconnexion */}
      <div className="p-4 border-t border-slate-800">
        <p className="text-slate-300 text-sm font-semibold truncate">{user.prenom} {user.nom}</p>
        <p className="text-slate-600 text-xs mb-2">{user.role}</p>
        <button onClick={logout} className="text-red-400 text-xs hover:text-red-300 bg-transparent border-none cursor-pointer p-0">
          Déconnexion
        </button>
      </div>
    </div>
  )
}