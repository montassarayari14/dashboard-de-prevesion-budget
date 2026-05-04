import { useState, useEffect } from "react"
import Dgsidebar from "../../component/dg/Dgsidebar"
import { useTheme } from "../../hooks/useTheme"
import Statutbadge from "../../component/dg/Statutbadge"
import Ecartpill from "../../component/dg/Ecartpill"
import API from "../../api/axios"

export default function DGHistorique() {
  const [historique, setHistorique] = useState([])
  const [anneeFiltre, setAnneeFiltre] = useState("toutes")
  const [dirFiltre, setDirFiltre] = useState("toutes")
  const { t } = useTheme()

  useEffect(() => {
    API.get("/directions/historique").then((res) => setHistorique(res.data))
  }, [])

  // Listes uniques pour les filtres
  const annees = ["toutes", ...new Set(historique.map((h) => h.annee))]
  const directions = ["toutes", ...new Set(historique.map((h) => h.code))]

  // Filtrage
  const filtered = historique.filter((h) => {
    const okAnnee = anneeFiltre === "toutes" || h.annee === anneeFiltre
    const okDir = dirFiltre === "toutes" || h.code === dirFiltre
    return okAnnee && okDir
  })

  return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <Dgsidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className={`text-[26px] font-bold mb-2 ${t.textMain}`}>Historique des campagnes</h1>
          <p className={`${t.textSub} text-[14px]`}>Décisions DG par année et direction</p>
        </div>

        {/* Filtres */}
        <div className="flex gap-3 mb-6">
          <select
            value={anneeFiltre}
            onChange={(e) => setAnneeFiltre(e.target.value)}
            className={`
              flex-1 max-w-md ${t.input} px-4 py-3 rounded-xl text-[14px]
              hover:${t.inputHover} focus:${t.inputFocus}
            `}
          >
            {annees.map((a) => (
              <option key={a} value={a}>
                {a === "toutes" ? "Toutes les années" : `Année ${a}`}
              </option>
            ))}
          </select>
          <select
            value={dirFiltre}
            onChange={(e) => setDirFiltre(e.target.value)}
            className={`
              flex-1 max-w-md ${t.input} px-4 py-3 rounded-xl text-[14px]
              hover:${t.inputHover} focus:${t.inputFocus}
            `}
          >
            {directions.map((d) => (
              <option key={d} value={d}>
                {d === "toutes" ? "Toutes les directions" : d}
              </option>
            ))}
          </select>
        </div>

        {/* Table - Audit style */}
        <div className={`${t.cardBg} ${t.border} rounded-2xl overflow-hidden shadow-lg`}>
          <table className="w-full">
            <thead>
              <tr className={`${t.thead} ${t.borderBottom}`}>
                {["Campagne", "Direction", "Directeur", "Demandé", "Alloué", "Écart", "Statut", "Décision", "Commentaire"].map((th) => (
                  <th key={th} className={`px-6 py-4 text-left ${t.textSub} font-semibold uppercase tracking-wider text-xs`}>
                    {th}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className={`${t.tbody}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className={`px-6 py-16 text-center ${t.textMute} text-[15px] font-medium`}>
                    <div className="flex flex-col items-center gap-3">
                      <span className={`text-5xl mb-3 ${t.textSub}`}>📜</span>
                      Aucun historique trouvé
                    </div>
                    <p className={`${t.textMute} text-[13px] mt-1`}>Essayez différents filtres</p>
                  </td>
                </tr>
              ) : (
                filtered.map((h, i) => (
                  <tr key={i} className={`${t.rowHover} ${t.borderBottom}`}>
                    <td className={`px-6 py-5 font-bold font-mono text-[15px] ${t.kpiBlue}`}>
                      {h.annee}
                    </td>
                    <td className="px-6 py-5">
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {h.code}
                      </span>
                    </td>
                    <td className={`px-6 py-5 ${t.textSub} text-[13px]`}>
                      {h.directeur}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`${t.warning} font-mono text-[14px] font-semibold`}>
                        {h.totalDemande?.toLocaleString("fr-FR") || 0} DT
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`${t.kpiGreen} font-mono text-[14px] font-semibold`}>
                        {h.budget?.toLocaleString("fr-FR") || 0} DT
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <Ecartpill demande={h.totalDemande} alloue={h.budget} />
                    </td>
                    <td className="px-6 py-5">
                      <Statutbadge statut={h.statut} />
                    </td>
                    <td className={`px-6 py-5 ${t.textSub} font-mono text-[13px]`}>
                      {h.decisionLe ? new Date(h.decisionLe).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className={`px-6 py-5 text-[13px] max-w-xs ${t.textSub}`}>
                      {h.commentaireDG || "Pas de commentaire"}
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

