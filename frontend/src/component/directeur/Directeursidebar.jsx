import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTheme } from "../../hooks/useTheme"

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
  { path: "/direction/parametres",   label: "Paramètres"      },
]

export default function DirecteurSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t }    = useTheme()
  const user     = JSON.parse(localStorage.getItem("user") || "{}")

  const nomDirection = NOMS_DIRECTIONS[user.direction] || user.direction || "Direction"

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className={`w-[210px] min-h-screen ${t.sidebarBg} border-r ${t.sidebarDivide} flex flex-col justify-between`}>
      <div>
        {/* En-tête */}
        <div className={`px-4 py-5 border-b ${t.sidebarDivide}`}>
          <p className={`${t.sidebarText} font-bold text-[13px] leading-snug mb-[2px]`}>
            {nomDirection}
          </p>
          <p className={`${t.sidebarTextMute} text-[11px]`}>Campagne 2025</p>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  block px-3 py-[9px] mb-[2px] rounded-lg text-[13px] no-underline
                  border-l-2 transition-colors
                  ${isActive ? t.sidebarLinkActive : t.sidebarLinkIdle}
                `}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Profil + déconnexion */}
      <div className={`px-4 py-3 border-t ${t.sidebarDivide}`}>
        <Link to="/direction/parametres" className="no-underline group">
          <p className={`${t.sidebarText} text-[13px] font-semibold mb-[2px] transition-colors`}>
            {user.prenom} {user.nom}
          </p>
          <p className={`${t.sidebarTextMute} text-[11px] mb-2`}>
            Directeur · <span className="text-[#818cf8]">{user.direction}</span>
          </p>
        </Link>
        <button
          onClick={logout}
          className="text-red-400 text-xs bg-transparent border-none cursor-pointer p-0"
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}