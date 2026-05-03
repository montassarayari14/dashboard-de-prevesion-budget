import { useState, useEffect } from "react"
import DirecteurSidebar from "../../component/directeur/DirecteurSidebar"
import StatutBadge from "../../component/directeur/StatutBadge"
import EcartPill from "../../component/directeur/EcartPill"
import { useTheme } from "../../hooks/useTheme"
import API from "../../api/axios"

export default function DirecteurHistorique() {
  const [historique, setHistorique] = useState([])
  const [loading, setLoading]       = useState(true)
  const { t } = useTheme()
  const user  = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    API.get(`/directions/historique?code=${user.direction}`)
      .then((res) => setHistorique(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <DirecteurSidebar />

      <div className="flex-1 p-6">
        <h1 className={`text-[28px] font-bold mb-1 ${t.textMain}`}>Historique des demandes</h1>
        <p className={`${t.textSub} mb-6`}>
          Toutes les campagnes budgétaires · Direction {user.direction}
        </p>

        <div className={`${t.cardBg} border ${t.border} rounded-[14px] overflow-hidden`}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b ${t.border} ${t.thead}`}>
                {["Campagne", "Total demandé", "Budget alloué", "Écart", "Statut", "Soumis le", "Traité le", "Commentaire DG"].map((th) => (
                  <th key={th} className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.5px]">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className={`p-10 text-center ${t.textSub}`}>Chargement...</td>
                </tr>
              ) : historique.length === 0 ? (
                <tr>
                  <td colSpan="8" className={`p-10 text-center ${t.textSub}`}>
                    Aucun historique disponible
                  </td>
                </tr>
              ) : (
                historique.map((h, i) => (
                  <tr key={i} className={`border-b ${t.tbodyBorder} ${t.rowHover}`}>
                    <td className={`px-4 py-3 font-bold font-mono ${t.textMain}`}>{h.annee}</td>
                    <td className={`px-4 py-3 font-mono text-[13px] ${t.kpiAmber}`}>
                      {h.totalDemande ? `${h.totalDemande.toLocaleString("fr-FR")} DT` : "—"}
                    </td>
                    <td className={`px-4 py-3 font-mono text-[13px] ${t.textSub}`}>
                      {h.budget ? `${h.budget.toLocaleString("fr-FR")} DT` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <EcartPill montant={h.totalDemande} montantN1={h.budget} />
                    </td>
                    <td className="px-4 py-3">
                      <StatutBadge statut={h.statut} />
                    </td>
                    <td className={`px-4 py-3 font-mono text-xs ${t.textSub}`}>
                      {h.soumisLe ? new Date(h.soumisLe).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className={`px-4 py-3 font-mono text-xs ${t.textSub}`}>
                      {h.decisionLe ? new Date(h.decisionLe).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className={`px-4 py-3 text-xs max-w-[200px] ${t.textSub}`}>
                      {h.commentaireDG || <span className={t.textMute}>—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}