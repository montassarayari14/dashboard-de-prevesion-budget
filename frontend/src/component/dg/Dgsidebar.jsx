import { Link, useLocation, useNavigate } from "react-router-dom"

// Liste des liens de navigation
const navLinks = [
  { path: "/dg/dashboard",    label: "Tableau de bord"   },
  { path: "/dg/demandes",     label: "Toutes les demandes" },
  { path: "/dg/en-attente",   label: "En attente"        },
  { path: "/dg/approuvees",   label: "Approuvées"        },
  { path: "/dg/rejetees",     label: "Rejetées"          },
  { path: "/dg/statistiques", label: "Statistiques"      },
  { path: "/dg/historique",   label: "Historique"        },
  { path: "/dg/parametres",   label: "Paramètres"        },
  { path: "/dg/ai-assistant", label: "Assistant IA"    },
]

export default function DGSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  // Récupère les infos de l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

// Sidebar theme-aware (DG)
  return (
    <div className="w-52 min-h-screen bg-sidebar-dg border-r border-bg-border/50 flex flex-col justify-between flex-shrink-0">

      
      {/* Titre en haut */}
      <div>
        <div className="p-5 border-b border-blue-500/50">
          <p className="text-white font-bold text-sm">Direction Générale</p>
          <p className="text-blue-100 text-xs mt-0.5">Campagne 2025</p>
        </div>

        {/* Navigation */}
        <nav className="p-2 mt-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors no-underline
                  ${isActive
                    ? "bg-blue-600 text-white border-l-2 border-amber-500"
                    : "text-blue-100 hover:text-white hover:bg-blue-700/80 border-l-2 border-transparent"
                  }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Profil + déconnexion */}
      <div className="p-4 border-t border-blue-500/50">
        <p className="text-white text-sm font-semibold truncate">
          {user.prenom} {user.nom}
        </p>
        <p className="text-blue-100 text-xs mb-2">Directeur Général</p>
        
        <button onClick={logout} className="text-red-200 text-xs hover:text-white bg-transparent border-none cursor-pointer p-0">
          Déconnexion
        </button>
      </div>

    </div>
  )
}
