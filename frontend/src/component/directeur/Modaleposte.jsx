import { useState, useEffect } from "react"
import { useTheme } from "../../hooks/useTheme"

const categories = ["Informatique", "RH / Formation", "Infrastructure", "Général", "Autre"]

export default function ModalePoste({ poste, onClose, onSave }) {
  const { t } = useTheme()

  const [form, setForm] = useState({
    nom: "", categorie: "Informatique", montant: "", montantN1: "", justification: ""
  })

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

  const inputClass =
    `w-full border rounded-lg px-3 py-2 text-[13px] outline-none box-border transition-colors ${t.input}`

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`fixed inset-0 ${t.overlay} flex items-center justify-center z-[1000]`}
    >
      <div className={`${t.modalBg} border ${t.border} rounded-2xl p-6 w-[400px] ${t.textMain}`}>

        <h3 className="text-[15px] font-bold mb-1">
          {poste ? "Modifier le poste" : "Nouveau poste de dépense"}
        </h3>
        <p className={`${t.textSub} text-xs mb-5`}>Campagne 2025</p>

        {/* Intitulé */}
        <label className={`${t.textSub} text-xs block mb-[6px]`}>Intitulé du poste *</label>
        <input
          className={`${inputClass} mb-[14px]`}
          placeholder="Ex : Licences logiciels"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
        />

        {/* Catégorie + Montant N */}
        <div className="grid grid-cols-2 gap-3 mb-[14px]">
          <div>
            <label className={`${t.textSub} text-xs block mb-[6px]`}>Catégorie</label>
            <select
              className={`w-full border rounded-lg px-3 py-2 text-[13px] outline-none ${t.select}`}
              value={form.categorie}
              onChange={(e) => setForm({ ...form, categorie: e.target.value })}
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={`${t.textSub} text-xs block mb-[6px]`}>Montant estimé 2025 (DT) *</label>
            <input
              className={inputClass}
              type="number"
              placeholder="Ex : 38000"
              value={form.montant}
              onChange={(e) => setForm({ ...form, montant: e.target.value })}
            />
          </div>
        </div>

        {/* Montant N-1 + Justification */}
        <div className="grid grid-cols-2 gap-3 mb-[14px]">
          <div>
            <label className={`${t.textSub} text-xs block mb-[6px]`}>Montant N-1 / 2024 (DT)</label>
            <input
              className={inputClass}
              type="number"
              placeholder="Ex : 32000"
              value={form.montantN1}
              onChange={(e) => setForm({ ...form, montantN1: e.target.value })}
            />
          </div>
          <div>
            <label className={`${t.textSub} text-xs block mb-[6px]`}>Justification</label>
            <input
              className={inputClass}
              placeholder="Ex : Nouvelles licences"
              value={form.justification}
              onChange={(e) => setForm({ ...form, justification: e.target.value })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-[10px] mt-1">
          <button
            onClick={onClose}
            className={`flex-1 py-[10px] rounded-[10px] border ${t.border} ${t.cardBg} ${t.textSub} cursor-pointer text-[13px]`}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-[10px] rounded-[10px] border ${t.btnPrimary} cursor-pointer text-[13px] font-semibold`}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}