import { useState, useEffect } from "react"
import DGSidebar from "../../component/dg/Dgsidebar"
import API from "../../api/axios"

export default function DGParametres() {
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const [email, setEmail] = useState(user.email || "")
  const [ancien, setAncien] = useState("")
  const [nouveau, setNouveau] = useState("")
  const [confirmer, setConfirmer] = useState("")
  const [msgProfil, setMsgProfil] = useState("")
  const [msgPass, setMsgPass] = useState("")
  const [errPass, setErrPass] = useState("")

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light"
  })

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light")
      localStorage.setItem("theme", "dark")
    } else {
      document.body.classList.add("light")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  async function saveProfil() {
    try {
      const res = await API.put(`/users/${user.id}/email`, { email })
      localStorage.setItem("user", JSON.stringify({ ...user, email: res.data.email }))
      setMsgProfil("Email mis à jour ✓")
      setTimeout(() => setMsgProfil(""), 3000)
    } catch {
      setMsgProfil("Erreur lors de la mise à jour")
    }
  }

  async function savePassword() {
    setErrPass("")
    setMsgPass("")
    if (!ancien || !nouveau || !confirmer) {
      setErrPass("Veuillez remplir tous les champs")
      return
    }
    if (nouveau !== confirmer) {
      setErrPass("Les mots de passe ne correspondent pas")
      return
    }
    if (nouveau.length < 6) {
      setErrPass("Minimum 6 caractères")
      return
    }
    try {
      await API.put(`/users/${user.id}/password`, {
        ancienMotDePasse: ancien,
        nouveauMotDePasse: nouveau,
      })
      setMsgPass("Mot de passe modifié ✓")
      setAncien("")
      setNouveau("")
      setConfirmer("")
      setTimeout(() => setMsgPass(""), 3000)
    } catch {
      setErrPass("Ancien mot de passe incorrect")
    }
  }

  const inputClass =
    "w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
  const disabledClass =
    "w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed"

  return (
    <div className="h-screen bg-[#050b1a] text-white flex overflow-hidden">
      <DGSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-1">Paramètres</h1>
        <p className="text-slate-400 mb-6">Gérez votre compte</p>

        {/* Apparence */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 mb-4">
          <h2 className="text-lg font-semibold mb-1">Apparence</h2>
          <p className="text-slate-400 text-sm mb-4">Choisissez le thème de l'interface</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Mode sombre</p>
              <p className="text-xs text-slate-400">
                {darkMode ? "Activé" : "Désactivé"}
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                darkMode ? "bg-indigo-600" : "bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                  darkMode ? "left-8" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Informations du compte */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Informations du compte</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Prénom</label>
              <input
                type="text"
                value={user.prenom || ""}
                disabled
                className={disabledClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nom</label>
              <input
                type="text"
                value={user.nom || ""}
                disabled
                className={disabledClass}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Rôle</label>
            <input
              type="text"
              value={user.role || ""}
              disabled
              className={disabledClass}
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          {msgProfil && (
            <p className="text-green-400 text-xs mb-3">{msgProfil}</p>
          )}
          <button
            onClick={saveProfil}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Sauvegarder l'email
          </button>
        </div>

        {/* Changer mot de passe */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Changer le mot de passe</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Ancien mot de passe
              </label>
              <input
                type="password"
                value={ancien}
                onChange={(e) => setAncien(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={nouveau}
                onChange={(e) => setNouveau(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
<label className="block text-xs text-slate-400 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmer}
                onChange={(e) => setConfirmer(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
          </div>
          {errPass && <p className="text-red-400 text-xs mt-3">{errPass}</p>}
          {msgPass && <p className="text-green-400 text-xs mt-3">{msgPass}</p>}
          <button
            onClick={savePassword}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Modifier le mot de passe
          </button>
        </div>
      </div>
    </div>
  )
}
