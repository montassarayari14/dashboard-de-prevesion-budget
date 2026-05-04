import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTheme } from "../../hooks/useTheme"

const navLinks = [
  { path: "/dg/dashboard",    label: "Tableau de bord"   },
  { path: "/dg/demandes",     label: "Toutes les demandes" },
  { path: "/dg/en-attente",   label: "En attente"        },
  { path: "/dg/approuvees",   label: "Approuvées"        },
  { path: "/dg/rejetees",     label: "Rejetées"          },
  { path: "/dg/statistiques", label: "Statistiques"      },
  { path: "/dg/historique",   label: "Historique"        },
  { path: "/dg/parametres",   label: "Paramètres"        },
  { path: "/dg/ai-assistant", label: "Assistant IA"      },
]

export default function DGSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLight, t } = useTheme()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

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
            Direction Générale
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
        <Link to="/dg/parametres" className="no-underline group">
          <p className={`${t.sidebarText} text-[13px] font-semibold mb-[2px] transition-colors group-hover:text-white`}>
            {user.prenom} {user.nom}
          </p>
          <p className={`${t.sidebarTextMute} text-[11px] mb-2`}>
            Directeur Général
          </p>
        </Link>
        <button
          onClick={logout}
          className={`
            text-xs bg-transparent border-none cursor-pointer p-0 transition-colors
            ${t.danger} hover:text-red-400
          `}
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}
