import { useState, useEffect } from "react"
import DirecteurSidebar from "../../component/directeur/DirecteurSidebar"
import StatutBadge from "../../component/directeur/StatutBadge"
import EcartPill from "../../component/directeur/EcartPill"
import ModalePoste from "../../component/directeur/ModalePoste"
import API from "../../api/axios"

const catColors = {
  "Informatique":   { bg: "#1e1b4b", color: "#a5b4fc" },
  "RH / Formation": { bg: "#2e1065", color: "#c084fc" },
  "Infrastructure": { bg: "#1c1300", color: "#fbbf24" },
  "Général":        { bg: "#052e16", color: "#4ade80" },
  "Autre":          { bg: "#1e293b", color: "#94a3b8" },
}

export default function DirecteurBudget() {
  const [direction, setDirection] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [posteEdit, setPosteEdit] = useState(null) // null = ajout, objet = modification
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    API.get("/directions/ma-direction")
      .then((res) => setDirection(res.data))
      .finally(() => setLoading(false))
  }, [])

  // Calcul du total
  const totalEstime = direction?.postes?.reduce((s, p) => s + (p.montant || 0), 0) || 0

  // Sauvegarder les postes en base
  async function sauvegarder(postes) {
    setSaving(true)
    try {
      const res = await API.put(`/directions/${direction._id}/postes`, { postes })
      setDirection(res.data)
    } catch { alert("Erreur lors de la sauvegarde") }
    setSaving(false)
  }

  // Ajouter ou modifier un poste
  function handleSavePoste(poste) {
    let newPostes
    if (posteEdit && posteEdit._index !== undefined) {
      // Modification
      newPostes = direction.postes.map((p, i) => i === posteEdit._index ? poste : p)
    } else {
      // Ajout
      newPostes = [...(direction.postes || []), poste]
    }
    sauvegarder(newPostes)
  }

  // Supprimer un poste
  function handleDelete(index) {
    if (!window.confirm("Supprimer ce poste ?")) return
    const newPostes = direction.postes.filter((_, i) => i !== index)
    sauvegarder(newPostes)
  }

  // Soumettre à la DG
  async function handleSoumettre() {
    if (!window.confirm("Soumettre cette demande à la Direction Générale ?")) return
    try {
      const res = await API.put(`/directions/${direction._id}/soumettre`, { postes: direction.postes })
      setDirection(res.data)
    } catch { alert("Erreur lors de la soumission") }
  }

  const canEdit = direction?.statut === "brouillon" || direction?.statut === "rejete"

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050b1a", display: "flex" }}>
      <DirecteurSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#475569" }}>Chargement...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#050b1a", color: "#fff", display: "flex" }}>
      <DirecteurSidebar />

      <div style={{ flex: 1, padding: "24px" }}>

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0" }}>Mon budget</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>Saisie des postes · Campagne 2025</p>
              <StatutBadge statut={direction?.statut || "brouillon"} />
            </div>
          </div>

          {canEdit && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => { setPosteEdit(null); setShowModal(true) }}
                style={{ padding: "9px 18px", background: "#1e1b4b", border: "1px solid #3730a3", color: "#a5b4fc", borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}
              >
                + Ajouter un poste
              </button>
              <button
                onClick={handleSoumettre}
                disabled={!direction?.postes?.length}
                style={{ padding: "9px 18px", background: "#4f46e5", border: "none", color: "#fff", borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontWeight: "600", opacity: !direction?.postes?.length ? 0.5 : 1 }}
              >
                Soumettre à la DG
              </button>
            </div>
          )}
        </div>

        {/* Message si rejeté */}
        {direction?.statut === "rejete" && direction?.commentaireDG && (
          <div style={{ background: "#450a0a", border: "1px solid #dc2626", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
            <p style={{ color: "#f87171", fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0" }}>Demande rejetée par la Direction Générale</p>
            <p style={{ color: "#fca5a5", fontSize: "12px", margin: 0 }}>{direction.commentaireDG}</p>
          </div>
        )}

        {/* Tableau des postes */}
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Poste", "Catégorie", "Montant 2025", "Montant 2024", "Écart", "Justification", canEdit && "Actions"].filter(Boolean).map((th) => (
                  <th key={th} style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!direction?.postes?.length ? (
                <tr>
                  <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#475569" }}>
                    Aucun poste ajouté. Cliquez sur "Ajouter un poste" pour commencer.
                  </td>
                </tr>
              ) : (
                direction.postes.map((p, i) => {
                  const cc = catColors[p.categorie] || catColors["Autre"]
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: "500", fontSize: "13px" }}>{p.nom}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: cc.bg, color: cc.color, padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>
                          {p.categorie}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontFamily: "monospace", fontSize: "13px" }}>
                        {(p.montant || 0).toLocaleString("fr-FR")} DT
                      </td>
                      <td style={{ padding: "12px 16px", color: "#64748b", fontFamily: "monospace", fontSize: "13px" }}>
                        {p.montantN1 ? `${p.montantN1.toLocaleString("fr-FR")} DT` : "—"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <EcartPill montant={p.montant} montantN1={p.montantN1} />
                      </td>
                      <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "12px" }}>
                        {p.justification || "—"}
                      </td>
                      {canEdit && (
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={() => { setPosteEdit({ ...p, _index: i }); setShowModal(true) }}
                              style={{ padding: "4px 10px", background: "#1e1b4b", border: "1px solid #3730a3", color: "#a5b4fc", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                            >Modifier</button>
                            <button
                              onClick={() => handleDelete(i)}
                              style={{ padding: "4px 10px", background: "#450a0a", border: "1px solid #dc2626", color: "#f87171", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                            >✕</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>

          {/* Total */}
          <div style={{ borderTop: "1px solid #1e293b", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#64748b", fontSize: "13px" }}>
              {saving ? "Enregistrement..." : `${direction?.postes?.length || 0} postes`}
            </span>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>
              Total : <span style={{ color: "#fbbf24", fontWeight: "700", fontFamily: "monospace" }}>
                {totalEstime.toLocaleString("fr-FR")} DT
              </span>{" "}
              / <span style={{ color: "#64748b", fontFamily: "monospace" }}>
                {(direction?.budget || 0).toLocaleString("fr-FR")} DT alloués
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Modale ajout/modification */}
      {showModal && (
        <ModalePoste
          poste={posteEdit}
          onClose={() => { setShowModal(false); setPosteEdit(null) }}
          onSave={handleSavePoste}
        />
      )}
    </div>
  )
}