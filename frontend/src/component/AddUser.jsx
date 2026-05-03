import { useState, useEffect } from "react"
import { useTheme } from "../hooks/useTheme"
import API from "../api/axios"

const DIRECTIONS = [
  { code: "AI", nom: "Direction Audit Interne"            },
  { code: "AJ", nom: "Direction Affaires Juridiques"      },
  { code: "CG", nom: "Direction Contrôle de Gestion"      },
  { code: "DI", nom: "Direction Informatique"             },
  { code: "RH", nom: "Direction Ressources Humaines"      },
  { code: "SP", nom: "Direction Stratégie & Planification" },
]

export default function AddUser({ show, onClose, newUser, setNewUser, onAdd }) {
  const { t, isLight } = useTheme()
  const [erreur, setErreur] = useState("")
  const [dgExiste, setDgExiste] = useState(false)

  // Vérifier si un DG existe déjà à chaque ouverture
  useEffect(() => {
    if (show) {
      API.get("/users").then((res) => {
        const existe = res.data.some((u) => u.role === "DG")
        setDgExiste(existe)
        // Si le rôle sélectionné était DG mais DG existe déjà → reset à Directeur
        if (existe && newUser.role === "DG") {
          setNewUser({ ...newUser, role: "Directeur", direction: "" })
        }
      })
    }
  }, [show])

  if (!show) return null

  function handleAdd() {
    setErreur("")
    if (!newUser.nom || !newUser.prenom || !newUser.email) {
      setErreur("Nom, prénom et email sont obligatoires.")
      return
    }
    if (!newUser.email.includes("@")) {
      setErreur("Email invalide.")
      return
    }
    if (newUser.role === "Directeur" && !newUser.direction) {
      setErreur("Veuillez sélectionner une direction.")
      return
    }
    if (newUser.role === "DG" && dgExiste) {
      setErreur("Un Directeur Général existe déjà.")
      return
    }
    onAdd()
  }

  const input = `w-full border rounded-xl px-4 py-2 text-sm outline-none transition-colors ${t.input}`
  const label = `block text-xs mb-1 ${t.textSub}`

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div className={`border rounded-2xl p-6 w-[440px] ${t.cardBg}`}>

        <h3 className={`font-semibold text-base mb-1 ${t.textMain}`}>
          Créer un compte utilisateur
        </h3>
        <p className={`text-xs mb-5 ${t.textSub}`}>
          Mot de passe par défaut :{" "}
          <span className={`font-mono ${isLight ? "text-[#2563EB]" : "text-indigo-400"}`}>
            123456
          </span>
        </p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={label}>Nom *</label>
            <input className={input} placeholder="Ex : Belhaj"
              value={newUser.nom}
              onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })} />
          </div>
          <div>
            <label className={label}>Prénom *</label>
            <input className={input} placeholder="Ex : Sana"
              value={newUser.prenom}
              onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })} />
          </div>
        </div>

        <div className="mb-3">
          <label className={label}>Email *</label>
          <input className={input} type="email" placeholder="sana@budget.tn"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        </div>

        <div className="mb-3">
          <label className={label}>Rôle *</label>
          <select className={input}
            value={newUser.role}
            onChange={(e) => setNewUser({
              ...newUser,
              role: e.target.value,
              direction: e.target.value === "DG" ? "-" : ""
            })}>
            <option value="Directeur">Directeur</option>
            <option value="DG" disabled={dgExiste}>
              {dgExiste ? "DG (déjà créé)" : "DG"}
            </option>
          </select>
        </div>

        {newUser.role === "Directeur" && (
          <div className="mb-3">
            <label className={label}>Direction *</label>
            <select className={input}
              value={newUser.direction || ""}
              onChange={(e) => setNewUser({ ...newUser, direction: e.target.value })}>
              <option value="">— Sélectionner une direction —</option>
              {DIRECTIONS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} · {d.nom}
                </option>
              ))}
            </select>
          </div>
        )}

        {erreur && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-2 mb-3">
            <p className="text-red-400 text-xs">{erreur}</p>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <button onClick={onClose}
            className={`flex-1 py-2 rounded-xl border text-sm transition-colors ${
              isLight
                ? "border-[#D1D5DB] text-[#6B7280] hover:bg-[#F3F4F6]"
                : "border-slate-700 text-slate-400 hover:bg-slate-800"
            }`}>
            Annuler
          </button>
          <button onClick={handleAdd}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold ${t.btnPrimary}`}>
            Créer le compte
          </button>
        </div>
      </div>
    </div>
  )
}