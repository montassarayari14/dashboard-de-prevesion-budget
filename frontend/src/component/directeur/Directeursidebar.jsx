import { Link, useLocation, useNavigate } from "react-router-dom"

// ── 6 directions fixes — même liste que partout dans le projet ──
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
]

export default function DirecteurSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // Nom complet de la direction depuis le code (ex: "DI" → "Direction Informatique")
  const nomDirection = NOMS_DIRECTIONS[user.direction] || user.direction || "Direction"

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div style={{
      width: "210px", minHeight: "100vh", background: "#0d1424",
      borderRight: "1px solid #1e293b", display: "flex",
      flexDirection: "column", justifyContent: "space-between"
    }}>
      <div>
        {/* En-tête sidebar */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #1e293b" }}>
          <p style={{ color: "#c7d2fe", fontWeight: "700", fontSize: "13px", margin: "0 0 2px 0", lineHeight: "1.3" }}>
            {nomDirection}
          </p>
          <p style={{ color: "#475569", fontSize: "11px", margin: "0" }}>
            Campagne 2025
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "8px" }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link key={link.path} to={link.path} style={{
                display: "block", padding: "9px 12px", marginBottom: "2px",
                borderRadius: "8px", textDecoration: "none", fontSize: "13px",
                color: isActive ? "#a5b4fc" : "#64748b",
                background: isActive ? "#1e1b4b" : "transparent",
                borderLeft: isActive ? "2px solid #6366f1" : "2px solid transparent",
              }}>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Profil + déconnexion */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1e293b" }}>
        <p style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600", margin: "0 0 2px 0" }}>
          {user.prenom} {user.nom}
        </p>
        <p style={{ color: "#475569", fontSize: "11px", margin: "0 0 8px 0" }}>
          Directeur · <span style={{ color: "#818cf8" }}>{user.direction}</span>
        </p>
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