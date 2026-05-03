import { Link, useLocation, useNavigate } from "react-router-dom"

// ── 6 directions fixes ──
const NOMS_DIRECTIONS = {
  AI: "Audit Interne",
  AJ: "Affaires Juridiques",
  CG: "Contrôle de Gestion",
  DI: "Direction Informatique",
  RH: "Ressources Humaines",
  SP: "Stratégie & Planification",
}

const navLinks = [
  { path: "/direction/dashboard",    label: "Tableau de bord" },
  { path: "/direction/budget",       label: "Mon budget"      },
  { path: "/direction/statistiques", label: "Statistiques"    },
  { path: "/direction/historique",   label: "Historique"      },
  { path: "/direction/parametres",  label: "Paramètres"      },
]

export default function DirecteurSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // Nom complet de la direction
  const nomDirection = NOMS_DIRECTIONS[user.direction] || user.direction || "Direction"

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

// Sidebar theme-aware (Directeur)
  return (
    <div className="w-52 min-h-screen bg-sidebar-dir border-r border-bg-border/50 flex flex-col justify-between flex-shrink-0">

      <div>
        {/* En-tête sidebar */}
        <div className="p-5 border-b border-blue-700">
          <p className="text-white font-bold text-sm">
            {nomDirection}
          </p>
          <p className="text-blue-200 text-xs">
            Campagne 2025
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-2 mt-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link key={link.path} to={link.path}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors no-underline
                  ${isActive
                    ? "bg-blue-600 text-white border-l-2 border-amber-500"
                    : "text-blue-200 hover:text-white hover:bg-blue-700 border-l-2 border-transparent"
                  }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Profil + déconnexion */}
      <div className="p-4 border-t border-blue-700">
        <p className="text-white text-sm font-semibold truncate">
          {user.prenom} {user.nom}
        </p>
        <p className="text-blue-200 text-xs mb-2">
          Directeur · <span className="text-amber-500">{user.direction}</span>
        </p>
        
        <button onClick={logout} className="text-red-300 text-xs hover:text-white bg-transparent border-none cursor-pointer p-0">
          Déconnexion
        </button>
      </div>
    </div>
  )
}
