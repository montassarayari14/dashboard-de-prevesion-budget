import { useState, useEffect } from "react"
import { getCategoriesForDirection } from "../../data/budgetStructure"

// Icônes SVG en dur pour éviter les imports
const IconWallet = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

const IconTag = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
)

const IconCurrency = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const IconDocument = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const IconX = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// Modale pour ajouter ou modifier un poste de dépense
export default function ModalePoste({ poste, onClose, onSave }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    nom: "", categorie: "", montant: "", montantN1: "", justification: ""
  })

  // Récupérer la direction de l'utilisateur connecté au chargement du composant
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const userDirection = user.direction || ""
    const cats = getCategoriesForDirection(userDirection)
    setCategories(cats)
    setLoading(false)
    
    // Définir la catégorie par défaut seulement si pas de modification de poste existant
    if (!poste && cats.length > 0) {
      setForm(prev => ({ ...prev, categorie: cats[0].code }))
    }
  }, [poste])

  // Si on modifie un poste existant, pré-remplir le formulaire
  useEffect(() => {
    if (poste) setForm({ ...poste })
  }, [poste])

  function handleSave() {
    if (!form.nom || !form.montant) return
    onSave({
      ...form,
      montant:   Number(form.montant),
      montantN1: Number(form.montantN1) || 0,
    })
    onClose()
  }

  // Styles reutilisables
  const inputClass = "w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all duration-200"
  const labelClass = "block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide"
  const iconClass = "text-slate-500"

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                {poste ? "Modifier le poste" : "Nouveau poste de dépense"}
              </h3>
              <p className="text-indigo-200 text-xs mt-0.5">Campagne budgétaire 2025</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <IconX />
            </button>
          </div>
        </div>

        {/* Body du formulaire */}
        <div className="p-6 space-y-5">
          {/* Intitulé */}
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5">
                <IconDocument /> Intitulé du poste
              </span>
            </label>
            <input
              className={inputClass}
              placeholder="Ex: Licences logicielles Microsoft 365"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
          </div>

          {/* Catégorie + Montant N */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <IconTag /> Catégorie
                </span>
              </label>
              {loading ? (
                <div className={inputClass + " animate-pulse"}>
                  <div className="h-6 bg-slate-700 rounded"></div>
                </div>
              ) : (
                <select
                  className={inputClass}
                  value={form.categorie}
                  onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.code} — {cat.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <IconCurrency /> Montant 2025
                </span>
              </label>
              <div className="relative">
                <input
                  className={inputClass + " pr-12"}
                  type="number"
                  placeholder="0"
                  value={form.montant}
                  onChange={(e) => setForm({ ...form, montant: e.target.value })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                  DT
                </span>
              </div>
            </div>
          </div>

          {/* Montant N-1 + Justification */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <IconCalendar /> Montant 2024
                </span>
              </label>
              <div className="relative">
                <input
                  className={inputClass + " pr-12"}
                  type="number"
                  placeholder="0"
                  value={form.montantN1}
                  onChange={(e) => setForm({ ...form, montantN1: e.target.value })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                  DT
                </span>
              </div>
            </div>
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <IconWallet /> Justification
                </span>
              </label>
              <input
                className={inputClass}
                placeholder="Ex: Renouvellement"
                value={form.justification}
                onChange={(e) => setForm({ ...form, justification: e.target.value })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-600/50 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300 transition-all duration-200 font-medium text-sm"
            >
              Annuler
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200"
            >
              {poste ? "Mettre à jour" : "Créer le poste"}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950/50 border-t border-slate-800/50">
          <p className="text-xs text-slate-500 text-center">
            Les champs marqués * sont obligatoires
          </p>
        </div>
      </div>
    </div>
  )
}
