import { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import API from "../api/axios"

export default function ReinitialiserMotDePasse() {
  const [searchParams]          = useSearchParams()
  const navigate                = useNavigate()
  const [mdp, setMdp]           = useState("")
  const [confirm, setConfirm]   = useState("")
  const [msg, setMsg]           = useState("")
  const [erreur, setErreur]     = useState("")
  const [loading, setLoading]   = useState(false)
  const [succes, setSucces]     = useState(false)
  const [tokenValide, setTokenValide] = useState(true)

  // Récupérer token et id depuis l'URL
  const token = searchParams.get("token")
  const id    = searchParams.get("id")

  useEffect(() => {
    if (!token || !id) {
      setTokenValide(false)
      setErreur("Lien invalide ou incomplet.")
    }
  }, [token, id])

  async function handleSubmit() {
    setErreur("")
    if (!mdp || !confirm)      { setErreur("Veuillez remplir tous les champs."); return }
    if (mdp !== confirm)       { setErreur("Les mots de passe ne correspondent pas."); return }
    if (mdp.length < 6)        { setErreur("Minimum 6 caractères."); return }

    setLoading(true)
    try {
      const res = await API.post("/auth/reinitialiser-mot-de-passe", {
        token,
        id,
        nouveauMotDePasse: mdp,
      })
      setMsg(res.data.message)
      setSucces(true)
      // Rediriger vers login après 3 secondes
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      if (err.response?.data?.message) {
        setErreur(err.response.data.message)
      } else {
        setErreur("Erreur. Le lien est peut-être expiré.")
      }
    }
    setLoading(false)
  }

  // Lien invalide
  if (!tokenValide) {
    return (
      <div className="min-h-screen bg-[#050b1a] flex items-center justify-center">
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 w-[380px] text-center">
          <p className="text-red-400 font-semibold mb-2">Lien invalide</p>
          <p className="text-slate-400 text-sm mb-4">Ce lien est invalide ou a expiré.</p>
          <Link to="/mot-de-passe-oublie" className="text-indigo-400 text-sm">
            Faire une nouvelle demande
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050b1a] flex items-center justify-center">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 w-[380px]">

        {/* En-tête */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
            B
          </div>
          <h1 className="text-xl font-bold text-white">Nouveau mot de passe</h1>
          <p className="text-slate-400 text-sm mt-1">
            Choisissez un mot de passe sécurisé (min. 6 caractères).
          </p>
        </div>

        {/* Succès */}
        {succes ? (
          <div className="bg-green-950 border border-green-800 rounded-xl p-4 text-center">
            <p className="text-green-400 text-sm font-semibold mb-1">Mot de passe modifié</p>
            <p className="text-green-300 text-xs">{msg}</p>
            <p className="text-slate-500 text-xs mt-2">
              Redirection vers la connexion...
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {/* Nouveau MDP */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* Confirmer MDP */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* Indicateur de force */}
            {mdp.length > 0 && (
              <div className="flex gap-1.5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${
                    mdp.length >= n * 4
                      ? n === 1 ? "bg-red-500" : n === 2 ? "bg-yellow-500" : "bg-green-500"
                      : "bg-slate-700"
                  }`} />
                ))}
                <span className="text-xs text-slate-500 ml-1">
                  {mdp.length < 4 ? "Faible" : mdp.length < 8 ? "Moyen" : "Fort"}
                </span>
              </div>
            )}

            {erreur && (
              <p className="text-red-400 text-xs text-center">{erreur}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </div>
        )}

        {/* Lien retour */}
        <div className="text-center mt-5">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 text-xs">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}