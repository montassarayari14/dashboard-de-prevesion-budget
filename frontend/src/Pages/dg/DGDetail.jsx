import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Dgsidebar from "../../component/dg/Dgsidebar"
import Statcard from "../../component/dg/Statcard"
import Statutbadge from "../../component/dg/Statutbadge"
import Ecartpill from "../../component/dg/Ecartpill"
import Modaledecision from "../../component/dg/Modaledecision"
import AIAssistantPanel from "../../component/ai/AIAssistantPanel"
import API from "../../api/axios"

export default function DGDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

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
    <div className="min-h-screen bg-bg-global flex">
      <Dgsidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-tertiary">Chargement...</p>
      </div>
    </div>
  )

  if (erreur || !direction) return (
    <div className="min-h-screen bg-bg-global flex">
      <Dgsidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-error">{erreur || "Direction introuvable"}</p>
      </div>
    </div>
  )

  const marge = (direction.budget && direction.totalDemande)
    ? direction.budget - direction.totalDemande
    : null

  return (
    <div className="min-h-screen bg-bg-global text-text-primary flex overflow-hidden">
      <Dgsidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* En-tête avec bouton retour */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/dg/demandes")}
            className="bg-transparent border-none text-text-secondary text-sm hover:text-text-primary cursor-pointer"
          >
            ← Retour
          </button>
          <span className="text-text-tertiary">/</span>
          <h1 className="text-2xl font-bold">Détail — Direction {direction.code}</h1>
          <Statutbadge statut={direction.statut || "brouillon"} />
        </div>

        {/* Infos direction */}
        <div className="bg-bg-card border border-bg-border rounded-xl p-4 flex gap-8 mb-5">
          <div>
            <p className="text-text-tertiary text-xs mb-1">Direction</p>
            <p className="text-text-primary text-sm font-semibold">{direction.nom}</p>
          </div>
          <div>
            <p className="text-text-tertiary text-xs mb-1">Directeur</p>
            <p className="text-text-secondary text-sm">{direction.directeur || "Non assigné"}</p>
          </div>
          <div>
            <p className="text-text-tertiary text-xs mb-1">Soumis le</p>
            <p className="text-text-secondary text-sm font-mono">
              {direction.soumisLe ? new Date(direction.soumisLe).toLocaleDateString("fr-FR") : "Non soumis"}
            </p>
          </div>
        </div>

        {/* Cartes KPI */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <Statcard
            label="Budget alloué"
            value={direction.budget ? direction.budget.toLocaleString("fr-FR") + " DT" : "—"}
            valueColor="accent-main"
          />
          <Statcard
            label="Total demandé"
            value={direction.totalDemande ? direction.totalDemande.toLocaleString("fr-FR") + " DT" : "—"}
            valueColor="warning"
          />
          <Statcard
            label="Marge disponible"
            value={marge !== null ? marge.toLocaleString("fr-FR") + " DT" : "—"}
            valueColor={marge !== null && marge >= 0 ? "success" : "error"}
            sub={marge !== null ? (marge >= 0 ? "Sous enveloppe" : "Dépassement !") : ""}
          />
        </div>

        {/* Tableau des postes budgétaires */}
        <div className="bg-bg-card border border-bg-border rounded-2xl overflow-hidden mb-5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-border">
                {["Poste budgétaire", "Catégorie", "Montant N", "Montant N-1", "Écart"].map((th) => (
                  <th key={th} className="px-4 py-3 text-left text-xs font-semibold uppercase text-text-tertiary">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {!direction.postes || direction.postes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-sm text-text-tertiary">
                    Aucun poste budgétaire soumis
                  </td>
                </tr>
              ) : (
                direction.postes.map((p, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-text-primary text-sm font-medium">{p.nom}</td>
                    <td className="px-4 py-3">
                      <span className="bg-accent-main/10 text-accent-main px-2.5 py-1 rounded-md text-xs">
                        {p.categorie}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-primary font-mono text-sm">
                      {p.montant?.toLocaleString("fr-FR")} DT
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-mono text-sm">
                      {p.montantN1?.toLocaleString("fr-FR")} DT
                    </td>
                    <td className="px-4 py-3">
                      <Ecartpill demande={p.montant} alloue={p.montantN1} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Commentaire DG si déjà traité */}
        {direction.commentaireDG && (
          <div className="bg-bg-card border border-bg-border rounded-xl p-4 mb-5">
            <p className="text-text-tertiary text-xs mb-1.5">Commentaire DG</p>
            <p className="text-text-secondary text-sm">{direction.commentaireDG}</p>
          </div>
        )}

        {/* Assistant IA */}
        {direction.statut === "en_attente" && (
          <AIAssistantPanel direction={direction} />
        )}

        {/* Bouton décision */}
        {direction.statut === "en_attente" && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="bg-accent-main text-text-primary font-semibold px-6 py-3 rounded-xl text-sm hover:bg-accent-hover transition-colors"
            >
              Prendre une décision
            </button>
          </div>
        )}
      </div>

      {/* Modale de décision */}
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

