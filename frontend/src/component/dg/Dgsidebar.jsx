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

  return (
    <div style={{ width: "210px", minHeight: "100vh", background: "#0d1424", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "0" }}>
      
      {/* Titre en haut */}
      <div>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #1e293b" }}>
          <p style={{ color: "#c7d2fe", fontWeight: "700", fontSize: "14px", margin: 0 }}>Direction Générale</p>
          <p style={{ color: "#475569", fontSize: "11px", margin: "2px 0 0 0" }}>Campagne 2025</p>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "8px" }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: "block",
                  padding: "9px 12px",
                  marginBottom: "2px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "13px",
                  color: isActive ? "#a5b4fc" : "#64748b",
                  background: isActive ? "#1e1b4b" : "transparent",
                  borderLeft: isActive ? "2px solid #6366f1" : "2px solid transparent",
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Profil + déconnexion en bas */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1e293b" }}>
        <p style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600", margin: "0 0 2px 0" }}>
          {user.prenom} {user.nom}
        </p>
        <p style={{ color: "#475569", fontSize: "11px", margin: "0 0 8px 0" }}>Directeur Général</p>
        <button
          onClick={logout}
          style={{ color: "#f87171", fontSize: "12px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}