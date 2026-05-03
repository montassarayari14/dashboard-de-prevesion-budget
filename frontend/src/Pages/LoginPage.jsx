import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../api/axios"

export default function LoginPage() {
  const navigate = useNavigate()

  // ✅ Deux states SÉPARÉS — email ne sera JAMAIS vidé après une erreur
  const [email, setEmail]       = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur]     = useState("")
  const [loading, setLoading]   = useState(false)
  const [bloque, setBloque]     = useState(false)
  const [minutesRestantes, setMinutesRestantes]       = useState(0)
  const [tentativesRestantes, setTentativesRestantes] = useState(null)

  async function handleLogin() {
    setErreur("")
    setBloque(false)
    setTentativesRestantes(null)

    if (!email || !motDePasse) {
      setErreur("Veuillez remplir tous les champs")
      return
    }

    setLoading(true)
    try {
      const res = await API.post("/auth/login", { email, motDePasse })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      navigate(res.data.redirect || "/dashboard")

    } catch (err) {
      const data   = err.response?.data || {}
      const status = err.response?.status

      if (status === 423) {
        // ✅ email conservé — seul le mot de passe est vidé
        setMotDePasse("")
        setBloque(true)
        setMinutesRestantes(data.minutesRestantes || 15)

      } else if (status === 403) {
        // ✅ email conservé — seul le mot de passe est vidé
        setMotDePasse("")
        setErreur("Compte désactivé. Contactez l'administrateur.")

      } else if (status === 401) {
        // ✅ email conservé — seul le mot de passe est vidé
        setMotDePasse("")
        setErreur(data.message || "Mot de passe incorrect")
        if (data.tentativesRestantes !== undefined) {
          setTentativesRestantes(data.tentativesRestantes)
        }

      } else {
        // ✅ email ET mot de passe conservés — erreur réseau, l'utilisateur peut réessayer
        setErreur("Erreur de connexion. Réessayez.")
      }
    }
    setLoading(false)
  }

  const isLight = localStorage.getItem("theme") === "light"

  const pageBg   = isLight ? "bg-[#f4f6fb]"  : "bg-[#050b1a]"
  const cardBg   = isLight ? "bg-white border-[#e2e7f0]" : "bg-[#0f172a] border-slate-800"
  const textMain = isLight ? "text-[#1a202c]" : "text-white"
  const textSub  = isLight ? "text-[#64748b]" : "text-slate-400"
  const inputBg  = isLight
    ? "bg-white border-[#dde3ef] text-[#1a202c] placeholder-[#94a3b8] focus:border-indigo-500"
    : "bg-[#1e293b] border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500"

  return (
    <div className={`min-h-screen ${pageBg} flex items-center justify-center transition-colors duration-300`}>
      <div className={`${cardBg} border rounded-2xl p-8 w-[400px] transition-colors duration-300`}>

        {/* En-tête */}
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
            B
          </div>
          <h1 className={`text-2xl font-bold ${textMain}`}>Budget Prévisionnel</h1>
          <p className={`${textSub} text-sm mt-1`}>Connectez-vous à votre espace</p>
        </div>

        <div className="space-y-4">

          {/* Bannière blocage */}
          {bloque && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm font-semibold mb-1">
                Compte bloqué — {minutesRestantes} min restante(s)
              </p>
              <p className="text-red-500 text-xs leading-5">
                Trop de tentatives échouées.{" "}
                <Link to="/mot-de-passe-oublie" className="underline font-medium">
                  Réinitialisez votre mot de passe
                </Link>{" "}
                ou réessayez dans {minutesRestantes} minute(s).
              </p>
            </div>
          )}

          {/* Champ Email — ✅ jamais vidé, même après erreur */}
          <div>
            <label className={`block text-xs ${textSub} mb-1`}>Email</label>
            <input
              type="email"
              placeholder="exemple@budget.tn"
              value={email}
              disabled={bloque}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${inputBg} disabled:opacity-40`}
            />
          </div>

          {/* Champ Mot de passe — ✅ vidé uniquement après erreur 401/403/423 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-xs ${textSub}`}>Mot de passe</label>
              <Link to="/mot-de-passe-oublie" className="text-xs text-indigo-500 hover:text-indigo-400 transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={motDePasse}
              disabled={bloque}
              onChange={(e) => setMotDePasse(e.target.value)}
              onKeyDown={(e) => !bloque && e.key === "Enter" && handleLogin()}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${inputBg} disabled:opacity-40`}
            />
          </div>

          {/* Message d'erreur */}
          {erreur && !bloque && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <p className="text-red-600 text-xs">{erreur}</p>
              {tentativesRestantes !== null && tentativesRestantes <= 2 && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠ Encore {tentativesRestantes} tentative(s) avant blocage.
                </p>
              )}
            </div>
          )}

          {/* Bouton connexion */}
          <button
            onClick={handleLogin}
            disabled={loading || bloque}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

        </div>
      </div>
    </div>
  )
}