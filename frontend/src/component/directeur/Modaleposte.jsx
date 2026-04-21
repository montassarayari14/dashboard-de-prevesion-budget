import { useState, useEffect } from "react"

const categories = ["Informatique", "RH / Formation", "Infrastructure", "Général", "Autre"]

// Modale pour ajouter ou modifier un poste de dépense
export default function ModalePoste({ poste, onClose, onSave }) {
  const [form, setForm] = useState({
    nom: "", categorie: "Informatique", montant: "", montantN1: "", justification: ""
  })

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

  const input = {
    background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px",
    padding: "8px 12px", color: "#ffffff", fontSize: "13px",
    outline: "none", width: "100%", boxSizing: "border-box"
  }

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{ background: "#161b27", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", width: "400px", color: "#fff" }}>

        <h3 style={{ fontSize: "15px", fontWeight: "700", margin: "0 0 4px 0" }}>
          {poste ? "Modifier le poste" : "Nouveau poste de dépense"}
        </h3>
        <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 20px 0" }}>Campagne 2025</p>

        {/* Intitulé */}
        <label style={{ color: "#64748b", fontSize: "12px", display: "block", marginBottom: "6px" }}>Intitulé du poste *</label>
        <input
          style={{ ...input, marginBottom: "14px" }}
          placeholder="Ex : Licences logiciels"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
        />

        {/* Catégorie + Montant N */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
          <div>
            <label style={{ color: "#64748b", fontSize: "12px", display: "block", marginBottom: "6px" }}>Catégorie</label>
            <select
              style={{ ...input }}
              value={form.categorie}
              onChange={(e) => setForm({ ...form, categorie: e.target.value })}
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: "#64748b", fontSize: "12px", display: "block", marginBottom: "6px" }}>Montant estimé 2025 (DT) *</label>
            <input
              style={input} type="number" placeholder="Ex : 38000"
              value={form.montant}
              onChange={(e) => setForm({ ...form, montant: e.target.value })}
            />
          </div>
        </div>

        {/* Montant N-1 + Justification */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
          <div>
            <label style={{ color: "#64748b", fontSize: "12px", display: "block", marginBottom: "6px" }}>Montant N-1 / 2024 (DT)</label>
            <input
              style={input} type="number" placeholder="Ex : 32000"
              value={form.montantN1}
              onChange={(e) => setForm({ ...form, montantN1: e.target.value })}
            />
          </div>
          <div>
            <label style={{ color: "#64748b", fontSize: "12px", display: "block", marginBottom: "6px" }}>Justification</label>
            <input
              style={input} placeholder="Ex : Nouvelles licences"
              value={form.justification}
              onChange={(e) => setForm({ ...form, justification: e.target.value })}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", borderRadius: "10px",
            border: "1px solid #1e293b", background: "transparent",
            color: "#94a3b8", cursor: "pointer", fontSize: "13px"
          }}>Annuler</button>
          <button onClick={handleSave} style={{
            flex: 1, padding: "10px", borderRadius: "10px",
            border: "none", background: "#4f46e5",
            color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600"
          }}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}