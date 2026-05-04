import { useState, useEffect } from "react"
import DirecteurSidebar from "../../component/directeur/DirecteurSidebar"
import StatutBadge from "../../component/directeur/StatutBadge"
import EcartPill from "../../component/directeur/EcartPill"
import Modaleposte from "../../component/directeur/Modaleposte"
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
    } catch { 
      alert("Erreur lors de la sauvegarde") 
    }
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
    } catch { 
      alert("Erreur lors de la soumission") 
    }
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
              <p className={`${t.textSub} text-[13px]`}>Saisie des postes IA · Campagne 2025</p>
              <StatutBadge statut={direction?.statut || "brouillon"} />
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-[10px]">
              <button
                onClick={() => { setPosteEdit(null); setShowModal(true) }}
                className={`px-[18px] py-[9px] border rounded-[10px] text-[13px] font-semibold cursor-pointer ${t.btnPrimary}`}
              >
+ Nouveau poste IA
              </button>
              <button
                onClick={handleSoumettre}
                disabled={!direction?.postes?.length}
                className={`px-[18px] py-[9px] border rounded-[10px] text-[13px] font-semibold cursor-pointer disabled:opacity-50 ${t.btnOutline}`}
              >
                Soumettre DG
              </button>
            </div>
          )}
        </div>

        {/* Rejet DG */}
        {direction?.statut === "rejete" && direction?.commentaireDG && (
          <div className={`${t.dangerBg} border ${t.dangerBdr} rounded-xl px-4 py-3 mb-5`}>
            <p className={`${t.danger} font-semibold mb-1`}>Rejet DG</p>
            <p className={`${t.danger} text-xs`}>{direction.commentaireDG}</p>
          </div>
        )}

        {/* Tableau postes */}
        <div className={`${t.cardBg} border ${t.border} rounded-2xl overflow-hidden shadow-lg`}>
          <table className="w-full">
            <thead className={`${t.thead} border-b ${t.border}`}>
              <tr>
                {["Poste", "Catégorie", "2025", "2024", "Écart", "IA", canEdit && "Actions"].filter(Boolean).map(th => (
                  <th key={th} className="px-4 py-4 text-left text-xs uppercase tracking-wider font-semibold">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!direction?.postes?.length ? (
                <tr>
                  <td colSpan="7" className={`p-12 text-center ${t.textSub}`}>
Aucun poste. Cliquez "+ Nouveau poste IA" pour commencer
                  </td>
                </tr>
              ) : (
                direction.postes.map((p, i) => {
                  const catKey = catTagClass[p.categorie] || "catAutre"
                  const aiStatus = p.aiValidation?.validation || '—'
                  return (
                    <tr key={i} className={`${t.rowHover} hover:bg-opacity-50 border-b ${t.tbodyBorder}`}>
                      <td className="px-4 py-4">
                        <div className="font-medium text-sm">{p.nom}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t[catKey]}`}>
                          {p.categorie}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono font-semibold text-sm">
                        {p.montant?.toLocaleString("fr-FR")} DT
                      </td>
                      <td className="px-4 py-4 font-mono text-sm opacity-75">
                        {p.montantN1 ? p.montantN1.toLocaleString("fr-FR") : '—'} DT
                      </td>
                      <td className="px-4 py-4">
                        <EcartPill small montant={p.montant} montantN1={p.montantN1} />
                      </td>
                      <td className="px-4 py-4 text-xs">
{aiStatus === 'Cohérent' && 'OK'}
                        {aiStatus === 'À vérifier' && '⚠️'}
                        {aiStatus === 'Incohérent' && '❌'}
                        {aiStatus === '—' ? 'Non analysé' : aiStatus}
                      </td>
                      {canEdit && (
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              className={`px-3 py-1 text-xs rounded-lg font-medium ${t.btnOutline}`}
                              onClick={() => {
                                setPosteEdit({ ...p, _index: i })
                                setShowModal(true)
                              }}
                            >
                              Éditer
                            </button>
                            <button
                              className={`px-2 py-1 text-xs rounded-lg ${t.btnDanger}`}
                              onClick={() => handleDelete(i)}
                            >
                              ×
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

          {/* Total ligne */}
          <div className="border-t ${t.border} px-6 py-4 bg-gradient-to-r from-blue-50/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium opacity-75">
                {direction.postes?.length || 0} postes {saving && '(sauvegarde...)'}
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {totalEstime.toLocaleString('fr-FR')} DT
                </div>
                <div className="text-sm opacity-75">
                  / {direction.budget?.toLocaleString('fr-FR')} DT alloués
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modaleposte
          poste={posteEdit}
          directionCode={direction?.code}
          onClose={() => {
            setShowModal(false)
            setPosteEdit(null)
          }}
          onSave={handleSavePoste}
        />
      )}
    </div>
  )
}
