import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const navLinks = [
  { path: "/dashboard",        label: "Tableau de bord", icon: "" },
  { path: "/admin/comptes",    label: "Comptes",          icon: "" },
  { path: "/admin/logs",       label: "Journaux d'audit", icon: "" },
  { path: "/admin/parametres", label: "Paramètres",       icon: "" },
]
const CURRENT_YEAR = new Date().getFullYear()

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem("user") || "{}")

  const [isLight, setIsLight] = useState(localStorage.getItem("theme") === "light")

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(localStorage.getItem("theme") === "light")
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    return () => observer.disconnect()
  }, [])

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  // ── Tokens sidebar ──────────────────────────────────────────────
  // Mode clair : sidebar bleu foncé #1E3A8A (design luxueux)
  // Mode sombre : sidebar très sombre #0d1117
  const bg      = isLight ? "bg-[#1E3A8A]"         : "bg-[#0d1117] border-slate-800"
  const divider = isLight ? "border-[#2d4fa3]"      : "border-slate-800"
  const title   = isLight ? "text-white"             : "text-indigo-300"
  const sub     = isLight ? "text-[#93c5fd]"         : "text-slate-600"
  const name    = isLight ? "text-white"             : "text-slate-200"
  const role    = isLight ? "text-[#93c5fd]"         : "text-slate-500"

  function linkCls(isActive) {
    if (isActive) return isLight
      ? "bg-[#2563EB] text-white border-l-2 border-white font-semibold shadow-sm"
      : "bg-indigo-950/60 text-indigo-300 border-l-2 border-indigo-500 font-semibold"
    return isLight
      ? "text-[#bfdbfe] hover:text-white hover:bg-[#2563EB]/60 border-l-2 border-transparent"
      : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 border-l-2 border-transparent"
  }

  const initiales = `${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`.toUpperCase()

  return (
    <div className={`w-56 min-h-screen border-r flex flex-col justify-between flex-shrink-0 transition-colors duration-300 ${bg}`}>

      {/* Logo / titre */}
      <div>
        <div className={`px-5 py-6 border-b ${divider}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-lg ${
              isLight
                ? "bg-white text-[#1E3A8A] shadow-white/20"
                : "bg-indigo-600 text-white shadow-indigo-500/30"
            }`}>
              B
            </div>
            <div>
              <p className={`font-bold text-sm ${title}`}>Admin</p>
              <p className={`text-xs ${sub}`}>Campagne {CURRENT_YEAR}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 mt-1 space-y-0.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 no-underline ${linkCls(isActive)}`}
              >
                <span className={`text-base leading-none ${isActive ? "opacity-100" : "opacity-60"}`}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Profil */}
      <div className={`p-4 border-t ${divider}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            isLight ? "bg-white text-[#1E3A8A]" : "bg-indigo-600 text-white"
          }`}>
            {initiales || "?"}
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-semibold truncate ${name}`}>
              {user.prenom} {user.nom}
            </p>
            <p className={`text-xs truncate ${role}`}>{user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className={`w-full text-xs py-1.5 rounded-lg border transition-colors ${
            isLight
              ? "border-red-300/50 text-red-200 hover:bg-red-600/30"
              : "border-red-900/50 text-red-400 hover:bg-red-950/40"
          }`}
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}