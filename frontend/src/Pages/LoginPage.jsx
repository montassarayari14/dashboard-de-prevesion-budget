import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../api/axios"

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm]               = useState({ email: "", motDePasse: "" })
  const [erreur, setErreur]           = useState("")
  const [loading, setLoading]         = useState(false)
  const [bloque, setBloque]           = useState(false)
  const [minutesRestantes, setMinutesRestantes] = useState(0)
  const [tentativesRestantes, setTentativesRestantes] = useState(null)

  async function handleLogin() {
    setErreur("")
    setBloque(false)
    setTentativesRestantes(null)

    if (!form.email || !form.motDePasse) {
      setErreur("Veuillez remplir tous les champs")
      return
    }

    setLoading(true)
    try {
      const res = await API.post("/auth/login", form)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      navigate(res.data.redirect || "/dashboard")

    } catch (err) {
      const data = err.response?.data || {}
      const status = err.response?.status

      if (status === 423) {
        // Compte bloqué
        setBloque(true)
        setMinutesRestantes(data.minutesRestantes || 15)
      } else if (status === 403) {
        setErreur("Compte désactivé. Contactez l'administrateur.")
      } else if (status === 401) {
        // Mauvais mot de passe — affiche tentatives restantes
        setErreur(data.message || "Email ou mot de passe incorrect")
        if (data.tentativesRestantes !== undefined) {
          setTentativesRestantes(data.tentativesRestantes)
        }
      } else {
        setErreur("Erreur de connexion. Réessayez.")
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050b1a] flex items-center justify-center">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 w-[400px]">

        {/* En-tête */}
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
            B
          </div>
          <h1 className="text-2xl font-bold text-white">Budget Prévisionnel</h1>
          <p className="text-slate-400 text-sm mt-1">Connectez-vous à votre espace</p>
        </div>

        <div className="space-y-4">

          {/* ── Bannière blocage compte ── */}
          {bloque && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm font-semibold mb-1">
                Compte bloqué — {minutesRestantes} minute(s) restante(s)
              </p>
              <p className="text-red-300 text-xs leading-5">
                Trop de tentatives échouées sur ce compte.<br />
                Attendez {minutesRestantes} minute(s) ou{" "}
                <Link
                  to="/mot-de-passe-oublie"
                  className="underline text-red-200 hover:text-white"
                >
                  réinitialisez votre mot de passe
                </Link>.
              </p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              placeholder="exemple@budget.tn"
              value={form.email}
              disabled={bloque}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-40"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-400">Mot de passe</label>
              <Link
                to="/mot-de-passe-oublie"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={form.motDePasse}
              disabled={bloque}
              onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
              onKeyDown={(e) => !bloque && e.key === "Enter" && handleLogin()}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-40"
            />
          </div>

          {/* Erreur mot de passe + compteur tentatives */}
          {erreur && !bloque && (
            <div className="bg-red-950/60 border border-red-900 rounded-xl px-4 py-2.5">
              <p className="text-red-400 text-xs">{erreur}</p>
              {tentativesRestantes !== null && tentativesRestantes <= 2 && (
                <p className="text-red-300 text-xs mt-1">
                  ⚠ Encore {tentativesRestantes} tentative(s) avant blocage du compte.
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