import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Dgsidebar from "../../component/dg/Dgsidebar"
import DemandesAICard from "../../component/dg/DemandesAICard"
import Statcard from "../../component/dg/Statcard"
import { useTheme } from "../../hooks/useTheme"
import API from "../../api/axios"

// Icons (copy from AIAssistant)
const IconRobot = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <rect x="9" y="7" width="6" height="4" rx="1" />
    <line x1="12" y1="7" x2="12" y2="4" />
    <circle cx="12" cy="3" r="1" />
    <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" />
    <line x1="12" y1="16" x2="12" y2="16" strokeWidth="3" />
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
  </svg>
)
const IconBarChart = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
)
const IconCheckCircle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)
const IconXCircle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)
const IconAlertTriangle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

export default function DGDemandes() {
  const [directions, setDirections] = useState([])
  const [search, setSearch] = useState("")
  const [filterRisque, setFilterRisque] = useState("")
  const [filterReco, setFilterReco] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { t, isLight } = useTheme()

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
    const matchSearch = d.code.toLowerCase().includes(search.toLowerCase()) || d.nom.toLowerCase().includes(search.toLowerCase())
    const matchFiltre = filtre === "tous" || d.statut === filtre
    const matchRisque = !filterRisque || (d.latestAnalyse?.risque === filterRisque)
    const matchReco = !filterReco || (d.latestAnalyse?.recommandation === filterReco)
    return matchSearch && matchFiltre && matchRisque && matchReco
  })

  const titres = {
    tous: "Toutes les demandes",
    en_attente: "Demandes en attente",
    approuve: "Demandes approuvées",
    rejete: "Demandes rejetées",
  }

  // KPI stats
  const stats = {
    total: directions.length,
    attente: directions.filter(d => d.statut === "en_attente").length,
    approuve: directions.filter(d => d.statut === "approuve").length,
    rejete: directions.filter(d => d.statut === "rejete").length,
    risqueEleve: directions.filter(d => d.latestAnalyse?.risque === "ELEVE").length,
  }

  const resetFilters = () => {
    setFilterRisque("")
    setFilterReco("")
    setSearch("")
  }

  return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <Dgsidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
              <IconRobot size={22} className="text-white" />
            </div>
            <div>
              <h1 className={`text-[28px] font-bold mb-1 ${t.textMain}`}>{titres[filtre]}</h1>
              <p className={`${t.textSub} text-[14px] flex items-center gap-1`}>
                {directions.length} directions · Campagne 2025
                {(filterRisque || filterReco || search) && (
                  <button onClick={resetFilters} className={`${t.btnOutline} text-xs px-3 py-1 rounded-lg ml-2`}>
                    Reset
                  </button>
                )}
              </p>
            </div>
          </div>
          <input
            placeholder="Rechercher direction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`
              w-72 ${t.input} px-4 py-3 rounded-xl text-[14px]
              hover:${t.inputHover} focus:${t.inputFocus}
            `}
          />
        </div>

        {/* KPI Grid - AI Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Statcard label="Total" value={stats.total} color="kpiBlue" />
          <Statcard label="En attente" value={stats.attente} color="warning" />
          <Statcard label="Approuvées" value={stats.approuve} color="kpiGreen" />
          <Statcard label="Rejetées" value={stats.rejete} color="danger" />
          <Statcard label="Risque élevé" value={stats.risqueEleve} color="kpiAmber" />
        </div>

        {/* AI Filters */}
        <div className={`${t.cardBg} ${t.border} rounded-2xl p-4 mb-6`}>
          <div className="flex flex-wrap gap-2">
            <select value={filterRisque} onChange={(e) => setFilterRisque(e.target.value)} className={`${t.input} px-3 py-2 text-sm rounded-lg`}>
              <option value="">Tous risques</option>
              <option value="ELEVE">Risque élevé</option>
              <option value="MOYEN">Moyen</option>
              <option value="FAIBLE">Faible</option>
            </select>
            <select value={filterReco} onChange={(e) => setFilterReco(e.target.value)} className={`${t.input} px-3 py-2 text-sm rounded-lg`}>
              <option value="">Toutes reco.</option>
              <option value="APPROUVER">Approuver</option>
              <option value="REJETER">Rejeter</option>
            </select>
          </div>
        </div>

        {/* AI Cards Grid */}
        <div className={`${t.cardBg} ${t.border} rounded-2xl p-6 shadow-lg`}>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className={`text-6xl mb-4 ${t.textSub}`}>📋</span>
              <p className={`${t.textMute} text-lg font-medium mb-2`}>Aucune demande correspond</p>
              <p className={`${t.textSub} text-sm`}>Essayez de modifier les filtres ou la recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((d) => (
                <DemandesAICard key={d._id} direction={d} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

