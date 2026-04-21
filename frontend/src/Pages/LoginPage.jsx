import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/axios"

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: "", motDePasse: "" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError("")
    if (!form.email || !form.motDePasse) {
      setError("Veuillez remplir tous les champs")
      return
    }
    setLoading(true)
    try {
      const res = await API.post("/auth/login", form)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // ✅ Redirection selon le rôle retourné par le backend :
      // Admin      → /dashboard
      // DG         → /dg/dashboard
      // Directeur  → /direction/dashboard
      navigate(res.data.redirect || "/dashboard")

    } catch (err) {
      if (err.response?.status === 403) {
        setError("Compte désactivé. Contactez l'administrateur.")
      } else {
        setError("Email ou mot de passe incorrect")
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050b1a] flex items-center justify-center">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 w-[380px]">

        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
            B
          </div>
          <h1 className="text-2xl font-bold text-white">Budget Prévisionnel</h1>
          <p className="text-slate-400 text-sm mt-1">Connectez-vous à votre espace</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              placeholder="exemple@budget.tn"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.motDePasse}
              onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  )
}