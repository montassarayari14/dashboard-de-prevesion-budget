import { useState, useEffect } from "react"
import Sidebar from "../component/SideBar"
import API from "../api/axios"

const DARK = {
  pageBg:   "bg-[#050b1a]",
  textMain: "text-white",
  textSub:  "text-slate-400",
  cardBg:   "bg-[#0f172a] border-slate-800",
  inputBg:  "bg-[#1e293b] border-slate-700 text-white",
  inputDis: "bg-[#1e293b] border-slate-700 text-slate-500",
}

const LIGHT = {
  pageBg:   "bg-[#F3F4F6]",
  textMain: "text-[#111827]",
  textSub:  "text-[#6B7280]",
  cardBg:   "bg-[#FFFFFF] border-[#E5E7EB]",
  inputBg:  "bg-[#FFFFFF] border-[#D1D5DB] text-[#111827]",
  inputDis: "bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]",
}

export default function ParametresPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const [email, setEmail]         = useState(user.email || "")
  const [ancien, setAncien]       = useState("")
  const [nouveau, setNouveau]     = useState("")
  const [confirmer, setConfirmer] = useState("")
  const [msgProfil, setMsgProfil] = useState("")
  const [msgPass, setMsgPass]     = useState("")
  const [errPass, setErrPass]     = useState("")

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light"
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.setAttribute("data-theme", "dark")
      document.body.style.background = "#050b1a"
      localStorage.setItem("theme", "dark")
    } else {
      root.setAttribute("data-theme", "light")
      document.body.style.background = "#F3F4F6"
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  const T = darkMode ? DARK : LIGHT

  const inputClass = `w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] transition-colors ${T.inputBg}`
  const disClass   = `w-full border rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed transition-colors ${T.inputDis}`

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
    setErrPass(""); setMsgPass("")
    if (!ancien || !nouveau || !confirmer) { setErrPass("Veuillez remplir tous les champs"); return }
    if (nouveau !== confirmer)             { setErrPass("Les mots de passe ne correspondent pas"); return }
    if (nouveau.length < 6)               { setErrPass("Minimum 6 caractères"); return }
    try {
      await API.put(`/users/${user.id}/password`, {
        ancienMotDePasse: ancien, nouveauMotDePasse: nouveau,
      })
      setMsgPass("Mot de passe modifié ✓")
      setAncien(""); setNouveau(""); setConfirmer("")
      setTimeout(() => setMsgPass(""), 3000)
    } catch {
      setErrPass("Ancien mot de passe incorrect")
    }
  }

  return (
    <div className={`h-screen ${T.pageBg} ${T.textMain} flex overflow-hidden transition-colors duration-300`}>
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">

        <h1 className="text-3xl font-bold mb-1">Paramètres</h1>
        <p className={`${T.textSub} mb-6`}>Gérez votre compte</p>

        {/* Apparence */}
        <div className={`border rounded-2xl p-6 mb-4 transition-colors duration-300 ${T.cardBg}`}>
          <h2 className="text-lg font-semibold mb-1">Apparence</h2>
          <p className={`${T.textSub} text-sm mb-4`}>Choisissez le thème de l'interface</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{darkMode ? "Mode sombre" : "Mode clair"}</p>
              <p className={`text-xs ${T.textSub}`}>
                {darkMode ? "Interface sombre activée" : "Interface claire activée"}
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                darkMode ? "bg-indigo-600" : "bg-[#2563EB]"
              }`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full shadow transition-all duration-300 ${
                darkMode ? "left-8 bg-white" : "left-1 bg-white"
              }`} />
            </button>
          </div>
        </div>

        {/* Informations du compte */}
        <div className={`border rounded-2xl p-6 mb-4 transition-colors duration-300 ${T.cardBg}`}>
          <h2 className="text-lg font-semibold mb-4">Informations du compte</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-xs ${T.textSub} mb-1`}>Prénom</label>
              <input type="text" value={user.prenom || ""} disabled className={disClass} />
            </div>
            <div>
              <label className={`block text-xs ${T.textSub} mb-1`}>Nom</label>
              <input type="text" value={user.nom || ""} disabled className={disClass} />
            </div>
          </div>
          <div className="mb-4">
            <label className={`block text-xs ${T.textSub} mb-1`}>Rôle</label>
            <input type="text" value={user.role || ""} disabled className={disClass} />
          </div>
          <div className="mb-4">
            <label className={`block text-xs ${T.textSub} mb-1`}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          {msgProfil && <p className="text-[#16A34A] text-xs mb-3">{msgProfil}</p>}
          <button onClick={saveProfil}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
            Sauvegarder l'email
          </button>
        </div>

        {/* Changer mot de passe */}
        <div className={`border rounded-2xl p-6 transition-colors duration-300 ${T.cardBg}`}>
          <h2 className="text-lg font-semibold mb-4">Changer le mot de passe</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-xs ${T.textSub} mb-1`}>Ancien mot de passe</label>
              <input type="password" value={ancien} onChange={(e) => setAncien(e.target.value)}
                placeholder="••••••••" className={inputClass} />
            </div>
            <div>
              <label className={`block text-xs ${T.textSub} mb-1`}>Nouveau mot de passe</label>
              <input type="password" value={nouveau} onChange={(e) => setNouveau(e.target.value)}
                placeholder="••••••••" className={inputClass} />
            </div>
            <div>
              <label className={`block text-xs ${T.textSub} mb-1`}>Confirmer le mot de passe</label>
              <input type="password" value={confirmer} onChange={(e) => setConfirmer(e.target.value)}
                placeholder="••••••••" className={inputClass} />
            </div>
          </div>
          {errPass && <p className="text-[#DC2626] text-xs mt-3">{errPass}</p>}
          {msgPass && <p className="text-[#16A34A] text-xs mt-3">{msgPass}</p>}
          <button onClick={savePassword}
            className="mt-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
            Modifier le mot de passe
          </button>
        </div>

      </div>
    </div>
  )
}