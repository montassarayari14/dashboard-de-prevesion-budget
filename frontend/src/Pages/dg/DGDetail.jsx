import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Dgsidebar from "../../component/dg/Dgsidebar"
import { useTheme } from "../../hooks/useTheme"
import Statcard from "../../component/dg/Statcard"
import Statutbadge from "../../component/dg/Statutbadge"
import Ecartpill from "../../component/dg/Ecartpill"
import Modaledecision from "../../component/dg/Modaledecision"
import AIAssistantPanel from "../../component/ai/AIAssistantPanel"
import API from "../../api/axios"

export default function DGDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTheme()

  const [direction, setDirection] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState("")

  useEffect(() => {
    API.get(`/directions/${id}`)
      .then((res) => setDirection(res.data))
      .catch(() => setErreur("Direction introuvable"))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDecision(dir, choix, commentaire) {
    try {
      const statut = choix === "approuver" ? "approuve" : "rejete"
      const res = await API.put(`/directions/${dir._id}/decision`, { statut, commentaire })
      setDirection(res.data)
    } catch (err) {
      alert("Erreur lors de la décision")
    }
  }

  if (loading) return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <Dgsidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className={`w-12 h-12 border-3 ${t.kpiBlue}/20 border-t-${t.kpiBlue.replace('text-', '')} rounded-full animate-spin`} />
          <p className={`${t.textSub} text-[15px]`}>Chargement direction...</p>
        </div>
      </div>
    </div>
  )

  if (erreur || !direction) return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <Dgsidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
        <div className={`text-6xl mb-4 ${t.danger}`}>!</div>
          <p className={`${t.danger} text-[18px] font-semibold mb-2`}>{erreur || "Direction introuvable"}</p>
          <button onClick={() => navigate("/dg/demandes")} className={`${t.btnPrimary} px-6 py-2 rounded-xl`}>
            ← Retour demandes
          </button>
        </div>
      </div>
    </div>
  )

  const marge = (direction.budget && direction.totalDemande)
    ? direction.budget - direction.totalDemande
    : null

  return (
    <div className={`min-h-screen ${t.pageBg} flex overflow-hidden`}>
      <Dgsidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dg/demandes")}
            className={`
              group flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold
              ${t.btnOutline} hover:${t.btnPrimary} hover:shadow-lg transition-all
            `}
          >
            <span className="text-lg">←</span>
            <span>Retour</span>
          </button>
          <h1 className={`text-[28px] font-bold ${t.textMain}`}>Direction {direction.code}</h1>
          <Statutbadge statut={direction.statut || "brouillon"} />
        </div>

        {/* Infos direction */}
        <div className={`${t.cardBg} ${t.border} rounded-2xl p-6 mb-6 flex gap-8 items-center`}>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-${t.kpiBlue.replace('text-', '')} to-purple-500 flex items-center justify-center shadow-xl">
            <span className="text-2xl font-bold text-white">{direction.code}</span>
          </div>
          <div>
            <h2 className={`${t.textMain} text-[20px] font-bold mb-1`}>{direction.nom}</h2>
            <div className="flex gap-6">
              <div>
                <p className={`${t.textSub} text-xs mb-1`}>Directeur</p>
                <p className={`${t.textMain} text-[15px]`}>{direction.directeur|| "Non assigné" }</p>
              </div>
              <div>
                <p className={`${t.textSub} text-xs mb-1`}>Soumis le</p>
                <p className={`${t.textSub} font-mono text-[13px]`}>
                  {direction.soumisLe ? new Date(direction.soumisLe).toLocaleDateString("fr-FR") : "Non soumis"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <Statcard
            label="Budget alloué"
            value={direction.budget ? direction.budget.toLocaleString("fr-FR") + " DT" : "—"}
            color="kpiBlue"
          />
          <Statcard
            label="Total demandé"
            value={direction.totalDemande ? direction.totalDemande.toLocaleString("fr-FR") + " DT" : "—"}
            color="warning"
          />
          <Statcard
            label="Marge restante"
            value={marge !== null ? marge.toLocaleString("fr-FR") + " DT" : "—"}
            color={marge !== null && marge >= 0 ? "kpiGreen" : "danger"}
          />
        </div>

        {/* Postes table - Audit style */}
        <div className={`${t.cardBg} ${t.border} rounded-2xl overflow-hidden mb-8 shadow-lg`}>
          <div className={`${t.cardHeader}`}>
            <h3 className={`${t.textMain} text-[16px] font-bold`}>Postes budgétaires</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className={`${t.thead} ${t.theadBorder}`}>
                {["Poste", "Catégorie", "Montant N", "Montant N-1", "Écart"].map((th) => (
                  <th key={th} className={`px-6 py-4 text-left ${t.textSub} font-semibold uppercase tracking-wider text-xs`}>
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`${t.tbody}`}>
              {!direction.postes || direction.postes.length === 0 ? (
                <tr>
                  <td colSpan="5" className={`px-6 py-12 text-center ${t.textMute} text-[14px]`}>
                    Aucun poste soumis
                  </td>
                </tr>
              ) : (
                direction.postes.map((p, i) => (
                  <tr key={i} className={`${t.rowHover} ${t.tbodyBorder}`}>
                    <td className={`px-6 py-4 font-semibold text-[14px] ${t.textMain}`}>
                      {p.nom}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold ${
                        p.categorie === "Informatique" ? `${t.kpiBlue} bg-blue-500/10` :
                        p.categorie === "RH / Formation" ? `${t.kpiPurple} bg-purple-500/10` :
                        p.categorie === "Infrastructure" ? `${t.warning} bg-orange-500/10` :
                        `${t.kpiGreen} bg-green-500/10`
                      }`}>
                        {p.categorie}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${t.kpiBlue} font-mono text-[14px] font-semibold`}>
                      {p.montant?.toLocaleString("fr-FR") || 0} DT
                    </td>
                    <td className={`px-6 py-4 ${t.textSub} font-mono text-[13px]`}>
                      {p.montantN1?.toLocaleString("fr-FR") || 0} DT
                    </td>
                    <td className="px-6 py-4">
                      <Ecartpill demande={p.montant} alloue={p.montantN1} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Commentaire DG */}
        {direction.commentaireDG && (
          <div className={`${t.cardBg} ${t.border} rounded-2xl p-6 mb-8`}>
            <h3 className={`${t.textMain} text-[16px] font-bold mb-3`}>Commentaire DG</h3>
            <p className={`${t.textSub} text-[14px] leading-relaxed`}>{direction.commentaireDG}</p>
          </div>
        )}


        {/* AI Panel */}
        <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 dark:from-slate-950/80 dark:to-slate-900/80 backdrop-blur-xl border border-indigo-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-2xl mb-8">
          <AIAssistantPanel direction={direction} />
        </div>


        {/* Bouton décision */}
        {direction.statut === "en_attente" && (
          <div className="flex justify-end">

          <button
            onClick={() => setShowModal(true)}
            className={`
              bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white
              dark:from-indigo-500 dark:to-blue-500 dark:hover:from-indigo-400 dark:hover:to-blue-400
              px-8 py-4 rounded-2xl text-[15px] font-bold shadow-2xl hover:shadow-indigo-500/40
              hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]
            `}
          >
            Décision IA
          </button>

          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && (
        <Modaledecision
          direction={direction}
          onClose={() => setShowModal(false)}
          onConfirm={handleDecision}
        />
      )}
    </div>
  )
}

