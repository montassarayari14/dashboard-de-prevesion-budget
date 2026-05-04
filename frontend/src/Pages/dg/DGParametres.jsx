import { useState } from "react"
import DGSidebar from "../../component/dg/Dgsidebar"
import { useTheme } from "../../hooks/useTheme"
import API from "../../api/axios"

const tabs = [
  { id: "profil",    label: "Profil",    icon: "👤" },
  { id: "securite",  label: "Sécurité",  icon: "🔒" },
  { id: "apparence", label: "Apparence", icon: "🎨" },
]


export default function DGParametres() {
  const { isLight, t, toggleTheme } = useTheme()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const [email, setEmail]         = useState(user.email || "")
  const [ancien, setAncien]       = useState("")
  const [nouveau, setNouveau]     = useState("")
  const [confirmer, setConfirmer] = useState("")
  const [msgProfil, setMsgProfil] = useState("")
  const [msgPass, setMsgPass]     = useState("")
  const [errPass, setErrPass]     = useState("")
  const [activeTab, setActiveTab] = useState("profil")

  const initiales = (user.prenom?.[0] || "") + (user.nom?.[0] || "")

  function handleToggleTheme() {
    toggleTheme()
  }

  async function saveProfil() {
    try {
      const res = await API.put(`/users/${user.id}/email`, { email })
      localStorage.setItem("user", JSON.stringify({ ...user, email: res.data.email }))
      setMsgProfil("Email mis à jour avec succès")
      setTimeout(() => setMsgProfil(""), 3500)
    } catch {
      setMsgProfil("Erreur lors de la mise à jour")
    }
  }

  async function savePassword() {
    setErrPass(""); setMsgPass("")
    if (!ancien || !nouveau || !confirmer) { setErrPass("Veuillez remplir tous les champs"); return }
    if (nouveau !== confirmer)             { setErrPass("Les mots de passe ne correspondent pas"); return }
    if (nouveau.length < 6)               { setErrPass("Minimum 6 caractères requis"); return }
    try {
      await API.put(`/users/${user.id}/password`, {
        ancienMotDePasse: ancien,
        nouveauMotDePasse: nouveau,
      })
      setMsgPass("Mot de passe modifié avec succès")
      setAncien(""); setNouveau(""); setConfirmer("")
      setTimeout(() => setMsgPass(""), 3500)
    } catch {
      setErrPass("Ancien mot de passe incorrect")
    }
  }

  const strength = nouveau.length >= 12 ? 4 : nouveau.length >= 9 ? 3 : nouveau.length >= 6 ? 2 : 1
  const strengthColors = ["bg-red-500", "bg-amber-500", "bg-green-500", "bg-blue-500"]
  const strengthLabels = ["Trop court", "Faible", "Moyen", "Fort"]

  const inputClass = `w-full border rounded-lg px-3 py-[10px] text-[13px] outline-none transition-colors ${t.input}`
  const disabledClass = `w-full border rounded-lg px-3 py-[10px] text-[13px] outline-none ${t.inputDis}`
  const labelClass = `block text-xs font-medium ${t.textSub} mb-[6px]`
  const cardClass = `${t.cardBg} border ${t.border} rounded-[14px] p-7`

  return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <DGSidebar />

      <div className="flex-1 px-8 py-7 overflow-y-auto">

        {/* En-tête */}
        <div className="mb-7">
          <h1 className={`text-[26px] font-bold mb-1 ${t.textMain}`}>Paramètres</h1>
          <p className={`${t.textSub} text-[14px]`}>Gérez votre compte et vos préférences</p>
        </div>

        <div className="grid grid-cols-[220px_1fr] gap-6 items-start">

          {/* Sidebar onglets */}
          <div className={`${t.cardBg} border ${t.border} rounded-[14px] overflow-hidden`}>

            {/* Avatar */}
            <div className={`px-5 py-6 border-b ${t.border} text-center`}>
              <div className="w-16 h-16 rounded-full bg-indigo-900 flex items-center justify-center mx-auto mb-3 text-[22px] font-bold text-white">
                {initiales || "?"}
              </div>
              <p className={`${t.textMain} font-semibold text-[14px] mb-[2px]`}>
                {user.prenom} {user.nom}
              </p>
              <p className={`${t.textSub} text-xs`}>Directeur Général</p>
            </div>

            {/* Onglets */}
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-[10px] px-3 py-[10px] mb-[2px]
                    rounded-lg border-none cursor-pointer text-[13px] text-left transition-colors
                    ${activeTab === tab.id
                      ? isLight
                        ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                        : "bg-[#1e1b4b] text-[#a5b4fc] font-semibold"
                      : `bg-transparent ${t.textSub} font-normal`
                    }
                  `}
                >
                  <span className="text-[15px]">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu */}
          <div>

            {/* ── PROFIL ── */}
            {activeTab === "profil" && (
              <div className={cardClass}>
                <h2 className={`${t.textMain} text-[16px] font-bold mb-1`}>Informations du compte</h2>
                <p className={`${t.textSub} text-[13px] mb-6`}>Consultez et mettez à jour vos informations personnelles</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Prénom</label>
                    <input type="text" value={user.prenom || ""} disabled className={disabledClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Nom</label>
                    <input type="text" value={user.nom || ""} disabled className={disabledClass} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Rôle</label>
                  <input type="text" value={user.role || ""} disabled className={disabledClass} />
                </div>

                <div className="mb-5">
                  <label className={labelClass}>Adresse email</label>
                  <input
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className={inputClass}
                  />
                </div>

                {msgProfil && (
                  <div className={`${t.successBg} border ${t.successBdr} rounded-lg px-[14px] py-[10px] mb-4`}>
                    <p className={`${t.success} text-[13px] font-medium`}>✓ {msgProfil}</p>
                  </div>
                )}

                <button
                  onClick={saveProfil}
                  className={`px-6 py-[10px] border rounded-[10px] text-[13px] font-semibold cursor-pointer ${t.btnPrimary}`}
                >
                  Sauvegarder les modifications
                </button>
              </div>
            )}

            {/* ── SÉCURITÉ ── */}
            {activeTab === "securite" && (
              <div className={cardClass}>
                <h2 className={`${t.textMain} text-[16px] font-bold mb-1`}>Changer le mot de passe</h2>
                <p className={`${t.textSub} text-[13px] mb-6`}>Assurez-vous d'utiliser un mot de passe fort (minimum 6 caractères)</p>

                <div className="mb-4">
                  <label className={labelClass}>Mot de passe actuel</label>
                  <input type="password" value={ancien} placeholder="••••••••"
                    onChange={(e) => setAncien(e.target.value)} className={inputClass} />
                </div>
                <div className="mb-4">
                  <label className={labelClass}>Nouveau mot de passe</label>
                  <input type="password" value={nouveau} placeholder="••••••••"
                    onChange={(e) => setNouveau(e.target.value)} className={inputClass} />
                </div>
                <div className="mb-5">
                  <label className={labelClass}>Confirmer le nouveau mot de passe</label>
                  <input type="password" value={confirmer} placeholder="••••••••"
                    onChange={(e) => setConfirmer(e.target.value)} className={inputClass} />
                </div>

                {nouveau && (
                  <div className="mb-4">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 h-1 rounded-sm transition-colors ${level <= strength ? strengthColors[strength - 1] : t.trackBg}`}
                        />
                      ))}
                    </div>
                    <p className={`${t.textMute} text-[11px]`}>
                      {strengthLabels[strength - 1]}
                    </p>
                  </div>
                )}

                {errPass && (
                  <div className={`${t.dangerBg} border ${t.dangerBdr} rounded-lg px-[14px] py-[10px] mb-4`}>
                    <p className={`${t.danger} text-[13px] font-medium`}>✕ {errPass}</p>
                  </div>
                )}
                {msgPass && (
                  <div className={`${t.successBg} border ${t.successBdr} rounded-lg px-[14px] py-[10px] mb-4`}>
                    <p className={`${t.success} text-[13px] font-medium`}>✓ {msgPass}</p>
                  </div>
                )}

                <button
                  onClick={savePassword}
                  className={`px-6 py-[10px] border rounded-[10px] text-[13px] font-semibold cursor-pointer ${t.btnPrimary}`}
                >
                  Modifier le mot de passe
                </button>
              </div>
            )}

            {/* ── APPARENCE ── */}
            {activeTab === "apparence" && (
              <div className={cardClass}>
                <h2 className={`${t.textMain} text-[16px] font-bold mb-1`}>Apparence</h2>
                <p className={`${t.textSub} text-[13px] mb-6`}>Personnalisez l'interface selon vos préférences</p>

                {/* Sélecteur de thème */}
                <div className="mb-6">
                  <p className={`${t.textMain} text-[13px] font-semibold mb-3`}>Thème de l'interface</p>
                  <div className="grid grid-cols-2 gap-3">

                    {/* Mode sombre */}
                    <button
                      onClick={() => !isLight && null || handleToggleTheme()}
                      className={`
                        text-left border-2 rounded-xl p-4 cursor-pointer transition-all
                        ${!isLight
                          ? "border-indigo-500 bg-[#1e1b4b]"
                          : `border-[#E5E7EB] ${t.cardBg} hover:border-[#2563EB]`
                        }
                      `}
                    >
                      <div className="w-full h-[60px] bg-[#050b1a] rounded-md mb-[10px] flex gap-1 p-[6px] overflow-hidden">
                        <div className="w-[30%] bg-[#0d1424] rounded" />
                        <div className="flex-1 flex flex-col gap-[3px]">
                          <div className="bg-[#0f172a] rounded flex-1" />
                          <div className="bg-[#0f172a] rounded flex-1" />
                        </div>
                      </div>
                      <p className={`text-[13px] font-semibold mb-[2px] ${!isLight ? "text-[#a5b4fc]" : t.textSub}`}>
                        🌙 Mode sombre
                      </p>
                      <p className={`text-[11px] ${t.textMute}`}>
                        {!isLight ? "Interface actuelle" : "Cliquer pour activer"}
                      </p>
                      {!isLight && (
                        <div className="mt-2 w-[18px] h-[18px] rounded-full bg-indigo-500 flex items-center justify-center">
                          <span className="text-white text-[10px]">✓</span>
                        </div>
                      )}
                    </button>

                    {/* Mode clair */}
                    <button
                      onClick={() => isLight && null || handleToggleTheme()}
                      className={`
                        text-left border-2 rounded-xl p-4 cursor-pointer transition-all
                        ${isLight
                          ? "border-[#2563EB] bg-[#EFF6FF]"
                          : `border-slate-800 ${t.cardBg} hover:border-indigo-500`
                        }
                      `}
                    >
                      <div className="w-full h-[60px] bg-gray-100 rounded-md mb-[10px] flex gap-1 p-[6px] overflow-hidden">
                        <div className="w-[30%] bg-[#1E3A8A] rounded" />
                        <div className="flex-1 flex flex-col gap-[3px]">
                          <div className="bg-white rounded flex-1" />
                          <div className="bg-white rounded flex-1" />
                        </div>
                      </div>
                      <p className={`text-[13px] font-semibold mb-[2px] ${isLight ? "text-[#2563EB]" : t.textSub}`}>
                        🌞 Mode clair
                      </p>
                      <p className={`text-[11px] ${t.textMute}`}>
                        {isLight ? "Interface actuelle" : "Cliquer pour activer"}
                      </p>
                      {isLight && (
                        <div className="mt-2 w-[18px] h-[18px] rounded-full bg-[#2563EB] flex items-center justify-center">
                          <span className="text-white text-[10px]">✓</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>


              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
