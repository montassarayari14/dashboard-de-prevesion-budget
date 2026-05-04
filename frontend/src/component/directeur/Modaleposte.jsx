import { useState, useEffect } from "react"
import { useTheme } from "../../hooks/useTheme"
import API from "../../api/axios"
import { getCategoriesForDirection } from "../../data/budgetCategories"
import AIFormAssistant from "./AIFormAssistant"

export default function Modaleposte({ poste, onClose, onSave, directionCode }) {
  const { t } = useTheme()

  const [form, setForm] = useState({
    nom: "", 
    categorie: "", 
    sousCategorie: "", 
    montant: "", 
    montantN1: "", 
    justification: ""
  })
  const [aiFeedback, setAiFeedback] = useState(null)

  useEffect(() => {
    if (poste) {
      setForm({
        nom: poste.nom || "",
        categorie: poste.categorie || "",
        sousCategorie: poste.sousCategorie || "",
        montant: poste.montant || "",
        montantN1: poste.montantN1 || "",
        justification: poste.justification || ""
      })
    } else {
      setForm({ nom: "", categorie: "", sousCategorie: "", montant: "", montantN1: "", justification: "" })
    }
  }, [poste])

  function handleSave() {
    if (!form.nom.trim() || !form.montant || !form.categorie) {
      alert('Nom, montant et catégorie obligatoires')
      return
    }
    
    if (aiFeedback?.validation === 'Incohérent') {
if (!confirm('IA détecte incohérence catégorie/direction. Soumettre quand même ?'))
        return
    }

    onSave({
      nom: form.nom.trim(),
      categorie: form.categorie,
      sousCategorie: form.sousCategorie.trim(),
      montant: Number(form.montant),
      montantN1: Number(form.montantN1) || 0,
      justification: form.justification.trim(),
      aiValidation: aiFeedback
    })
    onClose()
  }

  const inputClass = `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${t.input}`

  const catList = directionCode ? getCategoriesForDirection(directionCode) : []

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${t.overlay}`} onClick={onClose}>
      <div 
        className={`relative w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl ${t.modalBg} ${t.border} ${t.textMain} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b ${t.border}">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h3 className="text-lg font-bold">Nouveau poste</h3>
            <p className="text-xs opacity-75">Catégories adaptées à votre direction</p>
          </div>
          <button onClick={onClose} className="ml-auto text-xl opacity-60 hover:opacity-100 transition-all">
            ×
          </button>
        </div>

        {/* Nom */}
        <div className="mb-5">
          <label className="block text-xs font-medium mb-2 opacity-80">Intitulé *</label>
          <input
            className={inputClass}
            placeholder="Ex: Licences Office 365"
            value={form.nom}
            onChange={(e) => setForm({...form, nom: e.target.value})}
          />
        </div>

        {/* Catégorie + Montant */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium mb-2 opacity-80">
              Catégorie {catList.length ? `(${catList.length})` : ''}
            </label>
            <select
              className={`${inputClass} ${form.categorie ? 'ring-2 ring-blue-200' : ''}`}
              value={form.categorie}
              onChange={(e) => setForm({...form, categorie: e.target.value, sousCategorie: ''})}
            >
              <option value="">Choisir catégorie valide...</option>
              {catList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {!catList.length && directionCode && (
              <p className="text-xs mt-1 text-red-500">Aucune catégorie pour {directionCode}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 opacity-80">Montant 2025 (DT) *</label>
            <input
              type="number"
              className={inputClass}
              placeholder="45000"
              value={form.montant}
              onChange={(e) => setForm({...form, montant: e.target.value})}
            />
          </div>
        </div>

        {/* Sous-catégorie + N-1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium mb-2 opacity-80">Sous-catégorie</label>
            <input
              className={inputClass}
              placeholder="Ex: Licences bureau"
              value={form.sousCategorie}
              onChange={(e) => setForm({...form, sousCategorie: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 opacity-80">2024 (comparatif)</label>
            <input
              type="number"
              className={inputClass}
              placeholder="42000"
              value={form.montantN1}
              onChange={(e) => setForm({...form, montantN1: e.target.value})}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-xs font-medium mb-2 opacity-80">Description détaillée *</label>
          <textarea
            rows="4"
            className={`${inputClass} resize-none`}
            placeholder="Contexte, bénéfices, alternatives envisagées..."
            value={form.justification}
            onChange={(e) => setForm({...form, justification: e.target.value})}
          />
        </div>

        {/* AI Assistant */}
        {form.categorie && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <AIFormAssistant 
              directionCode={directionCode}
              formData={form}
              onFeedback={setAiFeedback}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t ${t.border}">
          <button
            className="flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${t.btnOutline} hover:scale-[1.02]"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${t.btnPrimary} hover:scale-[1.02] ${(!form.nom || !form.montant || !form.categorie) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSave}
            disabled={!form.nom.trim() || !form.montant || !form.categorie}
          >
            Enregistrer poste
          </button>
        </div>
      </div>
    </div>
  )
}

