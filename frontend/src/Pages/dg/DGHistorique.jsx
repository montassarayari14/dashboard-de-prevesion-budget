import { useState, useEffect } from "react"
import Dgsidebar from "../../component/dg/Dgsidebar"
import Statutbadge from "../../component/dg/Statutbadge"
import Ecartpill from "../../component/dg/Ecartpill"
import API from "../../api/axios"

export default function DGHistorique() {
  const [historique, setHistorique] = useState([])
  const [anneeFiltre, setAnneeFiltre] = useState("toutes")
  const [dirFiltre, setDirFiltre] = useState("toutes")

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
    <div className="min-h-screen bg-bg-global text-text-primary flex overflow-hidden">
      <Dgsidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Historique des campagnes</h1>
            <p className="text-text-secondary">Toutes les années · Toutes les directions</p>
          </div>

          {/* Filtres */}
          <div className="flex gap-2.5">
            <select
              value={anneeFiltre}
              onChange={(e) => setAnneeFiltre(e.target.value)}
              className="bg-bg-border border border-bg-border/50 rounded-xl px-3 py-2 text-sm text-text-secondary outline-none focus:border-accent-main"
            >
              {annees.map((a) => (
                <option key={a} value={a}>
                  {a === "toutes" ? "Toutes les années" : a}
                </option>
              ))}
            </select>
            <select
              value={dirFiltre}
              onChange={(e) => setDirFiltre(e.target.value)}
              className="bg-bg-border border border-bg-border/50 rounded-xl px-3 py-2 text-sm text-text-secondary outline-none focus:border-accent-main"
            >
              {directions.map((d) => (
                <option key={d} value={d}>
                  {d === "toutes" ? "Toutes les directions" : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau historique */}
        <div className="bg-bg-card border border-bg-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-border">
                {["Campagne", "Direction", "Directeur", "Demandé", "Alloué", "Écart", "Statut", "Décision le", "Commentaire"].map((th) => (
                  <th key={th} className="px-4 py-3 text-left text-xs font-semibold uppercase text-text-tertiary">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-10 text-center text-sm text-text-tertiary">
                    Aucun historique disponible
                  </td>
                </tr>
              ) : (
                filtered.map((h, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-text-primary font-bold font-mono text-sm">{h.annee}</td>
                    <td className="px-4 py-3">
                      <span className="bg-accent-main/10 text-accent-main px-2.5 py-1 rounded-md text-xs font-semibold">
                        {h.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-sm">{h.directeur}</td>
                    <td className="px-4 py-3 text-warning font-mono text-xs">{h.totalDemande?.toLocaleString("fr-FR")} DT</td>
                    <td className="px-4 py-3 text-text-secondary font-mono text-xs">{h.budget?.toLocaleString("fr-FR")} DT</td>
                    <td className="px-4 py-3">
                      <Ecartpill demande={h.totalDemande} alloue={h.budget} />
                    </td>
                    <td className="px-4 py-3">
                      <Statutbadge statut={h.statut} />
                    </td>
                    <td className="px-4 py-3 text-text-tertiary font-mono text-xs">
                      {h.decisionLe ? new Date(h.decisionLe).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs max-w-48 truncate">
                      {h.commentaireDG || "—"}
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

