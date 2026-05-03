import { useState } from "react"
import Directeursidebar from "../../component/directeur/Directeursidebar"
import API from "../../api/axios"
import { useTheme } from "../../ThemeContext"

// Noms des directions
const NOMS_DIRECTIONS = {
  AI: "Audit Interne",
  AJ: "Affaires Juridiques",
  CG: "Contrôle de Gestion",
  DI: "Direction Informatique",
  RH: "Ressources Humaines",
  SP: "Stratégie & Planification",
}

export default function DirecteurParametres() {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  
  // Nom complet de la direction
  const nomDirection = NOMS_DIRECTIONS[user.direction] || user.direction || "Direction"

  const [email, setEmail]         = useState(user.email || "")
  const [ancien, setAncien]       = useState("")
  const [nouveau, setNouveau]     = useState("")
  const [confirmer, setConfirmer] = useState("")
  const [msgProfil, setMsgProfil] = useState("")
  const [msgPass, setMsgPass]     = useState("")
  const [errPass, setErrPass]     = useState("")

  const { theme, toggleTheme } = useTheme()
  const isLight = theme === "light"

  // Couleurs selon le thème
  const bgMain = isLight ? "bg-[#F3F4F6]" : "bg-[#050b1a]"
  const cardBg = isLight ? "bg-white" : "bg-[#0f172a]"
  const cardBorder = isLight ? "border-gray-200" : "border-slate-800"
  const textMain = isLight ? "text-[#111827]" : "text-white"
  const textSub = isLight ? "text-[#6B7280]" : "text-slate-400"
  const inputBg = isLight ? "bg-gray-100" : "bg-[#1e293b]"
  const inputBorder = isLight ? "border-gray-300" : "border-slate-700"
  const inputText = isLight ? "text-[#111827]" : "text-white"
  const inputPlaceholder = isLight ? "placeholder-gray-400" : "placeholder-slate-500"

  const inputClass = `w-full ${inputBg} border ${inputBorder} rounded-xl px-4 py-2.5 text-sm ${inputText} outline-none focus:border-blue-500 ${inputPlaceholder}`
  const disabledClass = `w-full ${inputBg} border ${inputBorder} rounded-xl px-4 py-2.5 text-sm ${isLight ? "text-gray-500" : "text-slate-500"} outline-none cursor-not-allowed`
  const btnPrimary = isLight ? "bg-[#2563EB] hover:bg-[#1D4ED8]" : "bg-indigo-600 hover:bg-indigo-700"
  const textError = isLight ? "text-red-600" : "text-red-400"
  const textSuccess = isLight ? "text-green-600" : "text-green-400"

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
    if (!ancien || !nouveau || !confirmer) { setErrPass("Veuillez remplir tous les champs"); return }
    if (nouveau !== confirmer)             { setErrPass("Les mots de passe ne correspondent pas"); return }
    if (nouveau.length < 6)               { setErrPass("Minimum 6 caractères"); return }
    try {
      await API.put(`/users/${user.id}/password`, {
        ancienMotDePasse: ancien,
        nouveauMotDePasse: nouveau,
      })
      setMsgPass("Mot de passe modifié ✓")
      setAncien(""); setNouveau(""); setConfirmer("")
      setTimeout(() => setMsgPass(""), 3000)
    } catch {
      setErrPass("Ancien mot de passe incorrect")
    }
  }

  return (
    <div className={`h-screen ${bgMain} ${textMain} flex overflow-hidden`}>
      <Directeursidebar />
      <div className="flex-1 p-6 overflow-y-auto">

        <h1 className="text-3xl font-bold mb-1">Paramètres</h1>
        <p className={`${textSub} mb-6`}>Gérez votre compte</p>

        {/* Apparence */}
        <div className={`${cardBg} border ${cardBorder} rounded-2xl p-6 mb-4`}>
          <h2 className="text-lg font-semibold mb-1">Apparence</h2>
          <p className={`${textSub} text-sm mb-4`}>Choisissez le thème de l'interface</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Mode sombre</p>
              <p className={`${textSub} text-xs`}>{!isLight ? "Activé" : "Désactivé"}</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isLight ? "bg-gray-400" : "bg-indigo-600"}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${isLight ? "left-1" : "left-8"}`} />
            </button>
          </div>
        </div>

        {/* Informations du compte */}
        <div className={`${cardBg} border ${cardBorder} rounded-2xl p-6 mb-4`}>
          <h2 className="text-lg font-semibold mb-4">Informations du compte</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-xs ${textSub} mb-1`}>Prénom</label>
              <input type="text" value={user.prenom || ""} disabled className={disabledClass} />
            </div>
            <div>
              <label className={`block text-xs ${textSub} mb-1`}>Nom</label>
              <input type="text" value={user.nom || ""} disabled className={disabledClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-xs ${textSub} mb-1`}>Rôle</label>
              <input type="text" value={user.role || ""} disabled className={disabledClass} />
            </div>
            <div>
              <label className={`block text-xs ${textSub} mb-1`}>Direction</label>
              <input type="text" value={nomDirection} disabled className={disabledClass} />
            </div>
          </div>
          <div className="mb-4">
            <label className={`block text-xs ${textSub} mb-1`}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          {msgProfil && <p className={`${textSuccess} text-xs mb-3`}>{msgProfil}</p>}
          <button onClick={saveProfil}
            className={`${btnPrimary} text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors`}>
            Sauvegarder l'email
          </button>
        </div>

        {/* Changer mot de passe */}
        <div className={`${cardBg} border ${cardBorder} rounded-2xl p-6`}>
          <h2 className="text-lg font-semibold mb-4">Changer le mot de passe</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-xs ${textSub} mb-1`}>Ancien mot de passe</label>
              <input type="password" value={ancien} onChange={(e) => setAncien(e.target.value)}
                placeholder="••••••••" className={inputClass} />
            </div>
            <div>
              <label className={`block text-xs ${textSub} mb-1`}>Nouveau mot de passe</label>
              <input type="password" value={nouveau} onChange={(e) => setNouveau(e.target.value)}
                placeholder="••••••••" className={inputClass} />
            </div>
            <div>
              <label className={`block text-xs ${textSub} mb-1`}>Confirmer le mot de passe</label>
              <input type="password" value={confirmer} onChange={(e) => setConfirmer(e.target.value)}
                placeholder="••••••••" className={inputClass} />
            </div>
          </div>
          {errPass && <p className={`${textError} text-xs mt-3`}>{errPass}</p>}
          {msgPass && <p className={`${textSuccess} text-xs mt-3`}>{msgPass}</p>}
          <button onClick={savePassword}
            className={`mt-4 ${btnPrimary} text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors`}>
            Modifier le mot de passe
          </button>
        </div>

      </div>
    </div>
  )
}
