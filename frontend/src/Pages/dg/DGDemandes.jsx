import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import DGSidebar   from "../../component/dg/DGSidebar"
import StatutBadge from "../../component/dg/StatutBadge"
import EcartPill   from "../../component/dg/EcartPill"
import API         from "../../api/axios"

export default function DGDemandes() {
  const [directions, setDirections] = useState([])
  const [search, setSearch]         = useState("")
  const navigate  = useNavigate()
  const location  = useLocation()

  // Détermine le filtre selon l'URL active
  function getFiltreFromPath() {
    if (location.pathname === "/dg/en-attente") return "en_attente"
    if (location.pathname === "/dg/approuvees")  return "approuve"
    if (location.pathname === "/dg/rejetees")    return "rejete"
    return "tous"
  }

  const filtre = getFiltreFromPath()

  useEffect(() => {
    API.get("/directions").then((res) => setDirections(res.data))
  }, [])

  // Filtre les directions selon recherche et statut
  const filtered = directions.filter((d) => {
    const matchSearch = d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.nom.toLowerCase().includes(search.toLowerCase())
    const matchFiltre = filtre === "tous" || d.statut === filtre
    return matchSearch && matchFiltre
  })

  // Titre de la page selon le filtre
  const titres = {
    tous:       "Toutes les demandes",
    en_attente: "Demandes en attente",
    approuve:   "Demandes approuvées",
    rejete:     "Demandes rejetées",
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050b1a", color: "#ffffff", display: "flex" }}>
      <DGSidebar />

      <div style={{ flex: 1, padding: "24px" }}>

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0" }}>{titres[filtre]}</h1>
            <p style={{ color: "#64748b", margin: 0 }}>{directions.length} directions · Campagne 2025</p>
          </div>
          <input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "#1e293b", border: "1px solid #334155",
              borderRadius: "10px", padding: "8px 14px",
              color: "#ffffff", fontSize: "13px", outline: "none", width: "180px"
            }}
          />
        </div>

        {/* Tableau des demandes */}
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Direction", "Directeur", "Budget alloué", "Total demandé", "Écart", "Statut", "Soumis le", "Actions"].map((th) => (
                  <th key={th} style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
                    Aucune direction trouvée
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d._id} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ color: "#ffffff", fontWeight: "600", fontSize: "13px", margin: "0 0 2px 0" }}>{d.code}</p>
                      <p style={{ color: "#475569", fontSize: "11px", margin: 0 }}>{d.nom}</p>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#94a3b8", fontSize: "13px" }}>
                      {d.directeur || <span style={{ color: "#334155" }}>Non assigné</span>}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#64748b", fontSize: "13px", fontFamily: "monospace" }}>
                      {d.budget ? d.budget.toLocaleString("fr-FR") + " DT" : "—"}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#fbbf24", fontSize: "13px", fontFamily: "monospace" }}>
                      {d.totalDemande ? d.totalDemande.toLocaleString("fr-FR") + " DT" : <span style={{ color: "#334155" }}>—</span>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <EcartPill demande={d.totalDemande} alloue={d.budget} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatutBadge statut={d.statut || "brouillon"} />
                    </td>
                    <td style={{ padding: "14px 16px", color: "#475569", fontSize: "12px", fontFamily: "monospace" }}>
                      {d.soumisLe ? new Date(d.soumisLe).toLocaleDateString("fr-FR") : "Non soumis"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => navigate(`/dg/demandes/${d._id}`)}
                        style={{
                          padding: "5px 12px", borderRadius: "8px",
                          background: "#1e1b4b", border: "1px solid #3730a3",
                          color: "#a5b4fc", fontSize: "12px", cursor: "pointer"
                        }}
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