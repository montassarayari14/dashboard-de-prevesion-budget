import { useState, useEffect } from "react"
import DirecteurSidebar from "../../component/directeur/DirecteurSidebar"
import StatutBadge from "../../component/directeur/StatutBadge"
import EcartPill from "../../component/directeur/EcartPill"
import ModalePoste from "../../component/directeur/ModalePoste"
import { useTheme } from "../../hooks/useTheme"
import API from "../../api/axios"

const catTagClass = {
  "Informatique":   "catInfo",
  "RH / Formation": "catRH",
  "Infrastructure": "catInfra",
  "Général":        "catGen",
  "Autre":          "catAutre",
}

export default function DirecteurBudget() {
  const [direction, setDirection] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [posteEdit, setPosteEdit] = useState(null)
  const [saving, setSaving]       = useState(false)
  const { t } = useTheme()

  useEffect(() => {
    API.get("/directions/ma-direction")
      .then((res) => setDirection(res.data))
      .finally(() => setLoading(false))
  }, [])

  const totalEstime = direction?.postes?.reduce((s, p) => s + (p.montant || 0), 0) || 0

  async function sauvegarder(postes) {
    setSaving(true)
    try {
      const res = await API.put(`/directions/${direction._id}/postes`, { postes })
      setDirection(res.data)
    } catch { alert("Erreur lors de la sauvegarde") }
    setSaving(false)
  }

  function handleSavePoste(poste) {
    let newPostes
    if (posteEdit && posteEdit._index !== undefined) {
      newPostes = direction.postes.map((p, i) => i === posteEdit._index ? poste : p)
    } else {
      newPostes = [...(direction.postes || []), poste]
    }
    sauvegarder(newPostes)
  }

  function handleDelete(index) {
    if (!window.confirm("Supprimer ce poste ?")) return
    const newPostes = direction.postes.filter((_, i) => i !== index)
    sauvegarder(newPostes)
  }

  async function handleSoumettre() {
    if (!window.confirm("Soumettre cette demande à la Direction Générale ?")) return
    try {
      const res = await API.put(`/directions/${direction._id}/soumettre`, { postes: direction.postes })
      setDirection(res.data)
    } catch { alert("Erreur lors de la soumission") }
  }

  const canEdit = direction?.statut === "brouillon" || direction?.statut === "rejete"

  if (loading) return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <DirecteurSidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className={t.textSub}>Chargement...</p>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <DirecteurSidebar />

      <div className="flex-1 p-6">

        {/* En-tête */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className={`text-[28px] font-bold mb-1 ${t.textMain}`}>Mon budget</h1>
            <div className="flex items-center gap-[10px]">
              <p className={`${t.textSub} text-[13px]`}>Saisie des postes · Campagne 2025</p>
              <StatutBadge statut={direction?.statut || "brouillon"} />
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-[10px]">
              <button
                onClick={() => { setPosteEdit(null); setShowModal(true) }}
                className={`px-[18px] py-[9px] border rounded-[10px] text-[13px] font-semibold cursor-pointer ${t.btnOutline}`}
              >
                + Ajouter un poste
              </button>
              <button
                onClick={handleSoumettre}
                disabled={!direction?.postes?.length}
                className={`px-[18px] py-[9px] border rounded-[10px] text-[13px] font-semibold cursor-pointer disabled:opacity-50 ${t.btnPrimary}`}
              >
                Soumettre à la DG
              </button>
            </div>
          )}
        </div>

        {/* Message si rejeté */}
        {direction?.statut === "rejete" && direction?.commentaireDG && (
          <div className={`${t.dangerBg} border ${t.dangerBdr} rounded-xl px-4 py-[14px] mb-5`}>
            <p className={`${t.danger} text-[13px] font-semibold mb-1`}>Demande rejetée par la Direction Générale</p>
            <p className={`${t.danger} text-xs opacity-80`}>{direction.commentaireDG}</p>
          </div>
        )}

        {/* Tableau */}
        <div className={`${t.cardBg} border ${t.border} rounded-[14px] overflow-hidden`}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b ${t.border} ${t.thead}`}>
                {["Poste", "Catégorie", "Montant 2025", "Montant 2024", "Écart", "Justification", canEdit && "Actions"]
                  .filter(Boolean)
                  .map((th) => (
                    <th key={th} className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.5px]">
                      {th}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {!direction?.postes?.length ? (
                <tr>
                  <td colSpan="7" className={`p-10 text-center ${t.textSub}`}>
                    Aucun poste ajouté. Cliquez sur "Ajouter un poste" pour commencer.
                  </td>
                </tr>
              ) : (
                direction.postes.map((p, i) => {
                  const catKey = catTagClass[p.categorie] || "catAutre"
                  return (
                    <tr key={i} className={`border-b ${t.tbodyBorder} ${t.rowHover}`}>
                      <td className={`px-4 py-3 font-medium text-[13px] ${t.textMain}`}>{p.nom}</td>
                      <td className="px-4 py-3">
                        <span className={`${t[catKey]} px-[10px] py-[3px] rounded-md text-[11px] font-semibold`}>
                          {p.categorie}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-mono text-[13px] ${t.textMain}`}>
                        {(p.montant || 0).toLocaleString("fr-FR")} DT
                      </td>
                      <td className={`px-4 py-3 font-mono text-[13px] ${t.textSub}`}>
                        {p.montantN1 ? `${p.montantN1.toLocaleString("fr-FR")} DT` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <EcartPill montant={p.montant} montantN1={p.montantN1} />
                      </td>
                      <td className={`px-4 py-3 text-xs ${t.textSub}`}>
                        {p.justification || "—"}
                      </td>
                      {canEdit && (
                        <td className="px-4 py-3">
                          <div className="flex gap-[6px]">
                            <button
                              onClick={() => { setPosteEdit({ ...p, _index: i }); setShowModal(true) }}
                              className={`px-[10px] py-1 border rounded-md text-[11px] cursor-pointer ${t.btnOutline}`}
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(i)}
                              className={`px-[10px] py-1 border rounded-md text-[11px] cursor-pointer ${t.btnDanger}`}
                            >
                              ✕
                            </button>
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
          <div className={`border-t ${t.border} px-4 py-[14px] flex justify-between items-center`}>
            <span className={`${t.textSub} text-[13px]`}>
              {saving ? "Enregistrement..." : `${direction?.postes?.length || 0} postes`}
            </span>
            <span className={`text-[13px] ${t.textSub}`}>
              Total :{" "}
              <span className={`${t.kpiAmber} font-bold font-mono`}>
                {totalEstime.toLocaleString("fr-FR")} DT
              </span>
              {" / "}
              <span className={`${t.textMute} font-mono`}>
                {(direction?.budget || 0).toLocaleString("fr-FR")} DT alloués
              </span>
            </span>
          </div>
        </div>
      </div>

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