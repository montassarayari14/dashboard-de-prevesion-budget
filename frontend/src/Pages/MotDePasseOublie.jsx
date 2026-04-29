import { useState } from "react"
import { Link } from "react-router-dom"
import API from "../api/axios"

export default function MotDePasseOublie() {
  const [email, setEmail]     = useState("")
  const [msg, setMsg]         = useState("")
  const [erreur, setErreur]   = useState("")
  const [loading, setLoading] = useState(false)
  const [envoye, setEnvoye]   = useState(false)

  async function handleSubmit() {
    setErreur("")
    setMsg("")
    if (!email) { setErreur("Veuillez entrer votre email."); return }
    setLoading(true)
    try {
      const res = await API.post("/auth/mot-de-passe-oublie", { email })
      setMsg(res.data.message)
      setEnvoye(true)
    } catch (err) {
      if (err.response?.status === 429) {
        setErreur("Trop de demandes. Réessayez dans 1 heure.")
      } else {
        setErreur("Erreur lors de l'envoi. Réessayez.")
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050b1a] flex items-center justify-center">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 w-[380px]">

        {/* En-tête */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
            B
          </div>
          <h1 className="text-xl font-bold text-white">Mot de passe oublié</h1>
          <p className="text-slate-400 text-sm mt-1">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        {/* Formulaire */}
        {!envoye ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email</label>
              <input
                type="email"
                placeholder="exemple@budget.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>

            {erreur && (
              <p className="text-red-400 text-xs text-center">{erreur}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien"}
            </button>
          </div>
        ) : (
          // Message de succès
          <div className="bg-green-950 border border-green-800 rounded-xl p-4 text-center">
            <p className="text-green-400 text-sm font-semibold mb-1">Email envoyé</p>
            <p className="text-green-300 text-xs">{msg}</p>
            <p className="text-slate-500 text-xs mt-2">
              Vérifiez votre boîte mail et vos spams.
            </p>
          </div>
        )}

        {/* Lien retour connexion */}
        <div className="text-center mt-5">
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}