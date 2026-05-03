import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Dgsidebar from "../../component/dg/Dgsidebar"
import Statutbadge from "../../component/dg/Statutbadge"
import Ecartpill from "../../component/dg/Ecartpill"
import API from "../../api/axios"

export default function DGDemandes() {
  const [directions, setDirections] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  function getFiltreFromPath() {
    if (location.pathname === "/dg/en-attente") return "en_attente"
    if (location.pathname === "/dg/approuvees") return "approuve"
    if (location.pathname === "/dg/rejetees") return "rejete"
    return "tous"
  }

  const filtre = getFiltreFromPath()

  useEffect(() => {
    API.get("/directions").then((res) => setDirections(res.data))
  }, [])

  const filtered = directions.filter((d) => {
    const matchSearch = d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.nom.toLowerCase().includes(search.toLowerCase())
    const matchFiltre = filtre === "tous" || d.statut === filtre
    return matchSearch && matchFiltre
  })

  const titres = {
    tous: "Toutes les demandes",
    en_attente: "Demandes en attente",
    approuve: "Demandes approuvées",
    rejete: "Demandes rejetées",
  }

  return (
    <div className="min-h-screen bg-bg-global text-text-primary flex overflow-hidden">
      <Dgsidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">{titres[filtre]}</h1>
            <p className="text-text-secondary">{directions.length} directions · Campagne 2025</p>
          </div>
          <input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-bg-border border border-bg-border/50 rounded-xl px-4 py-2 text-sm text-text-primary outline-none w-48 focus:border-accent-main placeholder-text-tertiary"
          />
        </div>

        <div className="bg-bg-card border border-bg-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-border">
                {["Direction", "Directeur", "Budget alloué", "Total demandé", "Écart", "Statut", "Soumis le", "Actions"].map((th) => (
                  <th key={th} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-sm text-text-tertiary">
                    Aucune direction trouvée
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d._id}>
                    <td className="px-4 py-4">
                      <p className="text-text-primary font-semibold text-sm mb-1">{d.code}</p>
                      <p className="text-text-tertiary text-xs">{d.nom}</p>
                    </td>
                    <td className="px-4 py-4 text-text-secondary text-sm">
                      {d.directeur || <span className="text-text-tertiary">Non assigné</span>}
                    </td>
                    <td className="px-4 py-4 text-text-secondary text-sm font-mono">
                      {d.budget ? d.budget.toLocaleString("fr-FR") + " DT" : "—"}
                    </td>
                    <td className="px-4 py-4 text-warning text-sm font-mono">
                      {d.totalDemande ? d.totalDemande.toLocaleString("fr-FR") + " DT" : <span className="text-text-tertiary">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <Ecartpill demande={d.totalDemande} alloue={d.budget} />
                    </td>
                    <td className="px-4 py-4">
                      <Statutbadge statut={d.statut || "brouillon"} />
                    </td>
                    <td className="px-4 py-4 text-text-tertiary text-xs font-mono">
                      {d.soumisLe ? new Date(d.soumisLe).toLocaleDateString("fr-FR") : "Non soumis"}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => navigate(`/dg/demandes/${d._id}`)}
                        className="px-3 py-1.5 rounded-lg bg-accent-main/10 border border-accent-main/30 text-accent-main text-xs font-medium hover:bg-accent-hover/20 transition-colors"
                      >
                        Détail
                      </button>
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

