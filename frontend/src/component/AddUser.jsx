import { useState } from "react"

// ── 6 directions fixes du projet ──
const DIRECTIONS = [
  { code: "AI", nom: "Direction Audit Interne"           },
  { code: "AJ", nom: "Direction Affaires Juridiques"     },
  { code: "CG", nom: "Direction Contrôle de Gestion"     },
  { code: "DI", nom: "Direction Informatique"            },
  { code: "RH", nom: "Direction Ressources Humaines"     },
  { code: "SP", nom: "Direction Stratégie & Planification"},
]

const ROLES = ["Directeur", "Admin", "DG"]

export default function AddUser({ show, onClose, newUser, setNewUser, onAdd }) {
  const [erreur, setErreur] = useState("")

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
    onAdd()
  }

  const input = "w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
  const label = "block text-xs text-slate-400 mb-1"

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div className="bg-[#161b27] border border-slate-800 rounded-2xl p-6 w-[440px]">

        <h3 className="text-white font-semibold text-base mb-1">Créer un compte utilisateur</h3>
        <p className="text-slate-500 text-xs mb-5">
          Mot de passe par défaut : <span className="text-indigo-400 font-mono">123456</span>
        </p>

        {/* Nom + Prénom */}
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

        {/* Email */}
        <div className="mb-3">
          <label className={label}>Email *</label>
          <input className={input} type="email" placeholder="sana@budget.tn"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        </div>

        {/* Rôle */}
        <div className="mb-3">
          <label className={label}>Rôle *</label>
          <select className={input}
            value={newUser.role}
            onChange={(e) => setNewUser({
              ...newUser,
              role: e.target.value,
              direction: (e.target.value === "Admin" || e.target.value === "DG") ? "-" : ""
            })}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Direction — select fixe, visible uniquement pour Directeur */}
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

        {/* Erreur */}
        {erreur && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-2 mb-3">
            <p className="text-red-400 text-xs">{erreur}</p>
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-3 mt-2">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm hover:bg-slate-800">
            Annuler
          </button>
          <button onClick={handleAdd}
            className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold">
            Créer le compte
          </button>
        </div>
      </div>
    </div>
  )
}