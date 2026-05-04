import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import DGSidebar from "./Dgsidebar"
import { useTheme } from "../../hooks/useTheme"
import API from "../../api/axios"
import RiskBadge from "../ai/RiskBadge"
import AIRecommendationCard from "../ai/AIRecommendationCard"

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconRobot = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <rect x="9" y="7"  width="6"  height="4"  rx="1" />
    <line x1="12" y1="7" x2="12" y2="4" />
    <circle cx="12" cy="3" r="1" />
    <line x1="8"  y1="16" x2="8"  y2="16" strokeWidth="3" />
    <line x1="12" y1="16" x2="12" y2="16" strokeWidth="3" />
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
  </svg>
)
const IconBarChart = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4"  />
    <line x1="6"  y1="20" x2="6"  y2="14" />
    <line x1="2"  y1="20" x2="22" y2="20" />
  </svg>
)
const IconCheckCircle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)
const IconXCircle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9"  x2="9"  y2="15" />
    <line x1="9"  y1="9"  x2="15" y2="15" />
  </svg>
)
const IconAlertTriangle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9"  x2="12" y2="13"    />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const IconStar = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconClock = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)
const IconAlertCircle = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8"  x2="12" y2="12"   />
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const IconArrowRight = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)
const IconSend = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
const IconTrendingUp = ({ size = 13, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)
const IconInbox = ({ size = 36, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
  </svg>
)
const IconTrash = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)

// ─── KPI card definitions ─────────────────────────────────────────────────────
const KPI_CONFIG = [
  {
    label:  "Analyses totales",
    key:    "total",
    Icon:   IconBarChart,
    light:  { wrap: "bg-blue-100",       icon: "text-blue-600",    bar: "from-blue-500 to-cyan-400",      value: "text-blue-700",    trend: "text-blue-500"    },
    dark:   { wrap: "bg-blue-900/40",    icon: "text-blue-300",    bar: "from-blue-500 to-cyan-400",      value: "text-blue-300",    trend: "text-blue-400"    },
  },
  {
    label:  "Approuvées IA",
    key:    "approuver",
    Icon:   IconCheckCircle,
    light:  { wrap: "bg-emerald-100",    icon: "text-emerald-600", bar: "from-emerald-500 to-teal-400",   value: "text-emerald-700", trend: "text-emerald-500" },
    dark:   { wrap: "bg-emerald-900/40", icon: "text-emerald-300", bar: "from-emerald-500 to-teal-400",   value: "text-emerald-300", trend: "text-emerald-400" },
  },
  {
    label:  "Rejetées IA",
    key:    "rejeter",
    Icon:   IconXCircle,
    light:  { wrap: "bg-red-100",        icon: "text-red-600",     bar: "from-red-500 to-rose-400",       value: "text-red-700",     trend: "text-red-500"    },
    dark:   { wrap: "bg-red-900/40",     icon: "text-red-300",     bar: "from-red-500 to-rose-400",       value: "text-red-300",     trend: "text-red-400"    },
  },
  {
    label:  "Risque ÉLEVÉ",
    key:    "risqueEleve",
    Icon:   IconAlertTriangle,
    light:  { wrap: "bg-orange-100",     icon: "text-orange-600",  bar: "from-orange-500 to-red-400",     value: "text-orange-700",  trend: "text-orange-500"  },
    dark:   { wrap: "bg-orange-900/40",  icon: "text-orange-300",  bar: "from-orange-500 to-red-400",     value: "text-orange-300",  trend: "text-orange-400"  },
  },
  {
    label:  "Score moyen",
    key:    "moyenneScore",
    suffix: "/100",
    Icon:   IconStar,
    light:  { wrap: "bg-violet-100",     icon: "text-violet-600",  bar: "from-violet-500 to-purple-400",  value: "text-violet-700",  trend: "text-violet-500"  },
    dark:   { wrap: "bg-violet-900/40",  icon: "text-violet-300",  bar: "from-violet-500 to-purple-400",  value: "text-violet-300",  trend: "text-violet-400"  },
  },
]

const QUICK_QUESTIONS = [
  "Quelles sont les directions à risque ?",
  "Résume les analyses du jour",
  "Quel est le budget total demandé ?",
  "Donne-moi les recommandations rejetées",
]

// ─── Recommandation badge ──────────────────────────────────────────────────────
function RecoBadge({ value, isDark }) {
  if (value === "APPROUVER") return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ring-1 ring-inset
      ${isDark ? "bg-emerald-900/70 text-emerald-200 border border-emerald-700/80 ring-emerald-800/30" : "bg-emerald-100/90 text-emerald-800 border border-emerald-300/70 ring-emerald-200/50"}`}>
      <IconCheckCircle size={11} />
      Approuver
    </span>
  )
  if (value === "REJETER") return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ring-1 ring-inset
      ${isDark ? "bg-red-900/70 text-red-200 border border-red-700/80 ring-red-800/30" : "bg-red-100/90 text-red-800 border border-red-300/70 ring-red-200/50"}`}>
      <IconXCircle size={11} />
      Rejeter
    </span>
  )
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold
      ${isDark ? "bg-slate-800/60 text-slate-300 border border-slate-700/70" : "bg-slate-100/80 text-slate-700 border border-slate-200/60"}`}>
      {value || "—"}
    </span>
  )
}

// ─── Risque badge ──────────────────────────────────────────────────────────────
// Removed duplicate RisqueBadge - uses imported RiskBadge component now

// ─── Score bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score, isDark }) {
  const pct = Math.min(100, Math.max(0, score || 0))
  const color = pct >= 70
    ? (isDark ? "from-emerald-500 to-teal-400" : "from-emerald-500 to-teal-400")
    : pct >= 40
      ? (isDark ? "from-orange-500 to-amber-400" : "from-orange-500 to-amber-400")
      : (isDark ? "from-red-500 to-rose-400" : "from-red-500 to-rose-400")
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 h-1.5 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"} overflow-hidden`}>
        <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[11px] font-bold tabular-nums ${isDark ? "text-slate-300" : "text-slate-600"}`}>{pct}</span>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AIAssistant() {
  const navigate = useNavigate()
  const theme = useTheme()

  const [analyses, setAnalyses]               = useState([])
  const [filtered, setFiltered]               = useState([])
  const [loadingHist, setLoadingHist]         = useState(true)
  const [erreurHist, setErreurHist]           = useState("")
  const [directionsEnAttente, setDirectionsEnAttente] = useState([])
  const [loadingDirections, setLoadingDirections]     = useState(true)
  const [filterDirection, setFilterDirection] = useState("")
  const [filterRisque, setFilterRisque]       = useState("")
  const [filterReco, setFilterReco]           = useState("")
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Bonjour DG ! Je suis votre assistant IA pour analyser les budgets 2025. Posez-moi n'importe quelle question !" }
  ])
  const [question, setQuestion]       = useState("")
  const [loadingChat, setLoadingChat] = useState(false)
  const [erreurChat, setErreurChat]   = useState("")
  const chatEndRef = useRef(null)

  useEffect(() => {
    Promise.all([API.get("/ai/history?limit=50"), API.get("/directions")])
      .then(([histRes, dirRes]) => {
        const data = histRes.data.data || []
        setAnalyses(data); setFiltered(data)
        const enAttente = (dirRes.data || []).filter(d => d.statut === "en_attente")
        setDirectionsEnAttente(enAttente)
      })
      .catch(() => setErreurHist("Erreur chargement historique"))
      .finally(() => { setLoadingHist(false); setLoadingDirections(false) })
  }, [])

  useEffect(() => {
    let result = analyses
    if (filterDirection) result = result.filter(a => a.directionCode?.toLowerCase().includes(filterDirection.toLowerCase()))
    if (filterRisque)    result = result.filter(a => a.risque === filterRisque)
    if (filterReco)      result = result.filter(a => a.recommandation === filterReco)
    setFiltered(result)
  }, [filterDirection, filterRisque, filterReco, analyses])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [chatMessages])

  const stats = {
    total:        analyses.length,
    approuver:    analyses.filter(a => a.recommandation === "APPROUVER").length,
    rejeter:      analyses.filter(a => a.recommandation === "REJETER").length,
    risqueEleve:  analyses.filter(a => a.risque === "ELEVE").length,
    moyenneScore: analyses.length > 0
      ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / analyses.length) : 0,
  }

  async function envoyerQuestion(e, qOverride = null) {
    if (e) e.preventDefault()
    const q = (qOverride || question).trim()
    if (!q) return
    setQuestion("")
    setChatMessages(prev => [...prev, { role: "user", text: q }])
    setLoadingChat(true); setErreurChat("")
    try {
      const totalAlloue  = analyses.reduce((s, a) => s + (a.budgetAlloue  || 0), 0)
      const totalDemande = analyses.reduce((s, a) => s + (a.budgetDemande || 0), 0)
      const tauxGlobal   = totalAlloue > 0 ? Math.round((totalDemande / totalAlloue) * 100) : 0
      const contextBudget = {
        type: "global", directionCode: "GLOBAL",
        budgetAlloue: totalAlloue, budgetDemande: totalDemande, tauxConsommation: tauxGlobal,
        resume: `${stats.total} analyses. ${stats.approuver} approbations, ${stats.rejeter} rejets. ${stats.risqueEleve} risques élevés. Score moyen : ${stats.moyenneScore}/100. Alloué : ${totalAlloue.toLocaleString("fr-FR")} DT. Demandé : ${totalDemande.toLocaleString("fr-FR")} DT. Taux : ${tauxGlobal}%.`,
      }
      const res = await API.post("/ai/chat", { question: q, contextBudget })
      setChatMessages(prev => [...prev, { role: "assistant", text: res.data.reponse || "Réponse vide." }])
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur de communication avec l'IA"
      setErreurChat(msg)
      setChatMessages(prev => [...prev, { role: "assistant", text: "Attention : " + msg }])
    } finally { setLoadingChat(false) }
  }

  async function supprimerAnalyse(id) {
    if (!confirm("Supprimer cette analyse ?")) return
    try { await API.delete(`/ai/history/${id}`); setAnalyses(prev => prev.filter(a => a._id !== id)) }
    catch { alert("Erreur suppression") }
  }

  // ─── Colour tokens ─────────────────────────────────────────────────────────
const { t: themeT, isDark } = theme
const c = isDark ? {
    page:           "bg-slate-950",
    card:           "bg-slate-900/95 border-slate-800/70 backdrop-blur-sm shadow-2xl",
    cardHdr:        "bg-slate-900/98 backdrop-blur-md border-slate-800/50 shadow-lg",
    divider:        "border-slate-800/50",
    textMain:       "text-slate-50 font-semibold",
    textSub:        "text-slate-300",
    textMuted:      "text-slate-500",
    input:          "bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-400 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/40 transition-all duration-200",
    select:         "bg-slate-800/50 border border-slate-700 text-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all duration-200",
    btnPrimary:     "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-900/30 active:scale-[0.98]",
    btnDanger:      "text-slate-400 hover:text-red-400 hover:bg-red-900/40 transition-all duration-150",
    userBubble:     "bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white shadow-xl shadow-indigo-900/40",
    botBubble:      "bg-slate-800/90 border border-slate-700/60 text-slate-200 backdrop-blur-sm shadow-lg",
    msgArea:        "bg-slate-950/70 backdrop-blur-sm",
    quickBtn:       "border border-slate-700/50 text-slate-400 hover:border-indigo-500 hover:text-indigo-300 hover:bg-indigo-900/30 bg-slate-800/40 backdrop-blur-sm transition-all duration-200",
    dot:            "bg-indigo-400",
    pendingCard:    "bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-slate-700 hover:border-amber-400/70 hover:shadow-amber-900/30 hover:shadow-xl",
    pendingIcon:    "from-amber-500 to-orange-500",
    pendingLabel:   "border border-slate-600/50 text-slate-300 hover:bg-slate-800/60 backdrop-blur-sm",
    spinner:        "border-slate-700/50 border-t-indigo-500",
    emptyWrap:      "bg-slate-800/70 backdrop-blur-sm text-slate-400 border border-slate-700/50",
    emptyReset:     "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-900/40",
    errRow:         "bg-red-950/70 border-red-900/60 backdrop-blur-sm",
    errText:        themeT.danger,
    liveText:       themeT.success,
    liveDot:        "bg-emerald-400",
    // Analysis rows - Enhanced colors
    rowBase:        "bg-slate-800/60 border border-slate-700/70 hover:border-indigo-500/60 hover:bg-slate-800/80 hover:shadow-indigo-900/20 hover:shadow-lg backdrop-blur-sm transition-all duration-200",
    rowCode:        "text-indigo-300 font-bold tracking-wide",
    rowDate:        "text-slate-400 font-mono text-[13px]",
    rowBudget:      "text-slate-200 font-bold tracking-wide",
    rowBudgetLabel: "text-slate-400 font-semibold uppercase tracking-wider text-[11px]",
    rowScore:       "text-indigo-300 font-bold",
    rowNomLabel:    "text-slate-400 uppercase tracking-wider text-[11px]",
    rowNom:         "text-slate-100 font-semibold",
    rowJustLabel:   "text-slate-400 uppercase tracking-wider text-[11px] font-semibold",
    rowJust:        "text-slate-300 leading-relaxed",
  } : {
    page:           "bg-gradient-to-br from-slate-50 to-blue-50/30",
    card:           "bg-white/95 border-slate-200/60 backdrop-blur-sm shadow-xl",
    cardHdr:        "bg-white/98 backdrop-blur-md border-slate-200/50 shadow-lg",
    divider:        "border-slate-200/60",
    textMain:       "text-slate-900 font-semibold",
    textSub:        "text-slate-600",
    textMuted:      "text-slate-500",
    input:          "bg-white/80 border border-slate-300/50 text-slate-900 placeholder-slate-400 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/40 transition-all duration-200 backdrop-blur-sm",
    select:         "bg-white/80 border border-slate-300/50 text-slate-800 rounded-xl outline-none focus:border-indigo-400 transition-all duration-200 backdrop-blur-sm",
    btnPrimary:     "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-200/50 active:scale-[0.98]",
    btnDanger:      "text-slate-500 hover:text-red-500 hover:bg-red-50/80 transition-all duration-150",
    userBubble:     "bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white shadow-2xl shadow-indigo-300/50",
    botBubble:      "bg-white/90 border border-slate-200/60 text-slate-800 backdrop-blur-sm shadow-xl",
    msgArea:        "bg-slate-50/80 backdrop-blur-sm",
    quickBtn:       "border border-slate-200/50 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/80 bg-white/60 backdrop-blur-sm transition-all duration-200",
    dot:            "bg-indigo-500",
    pendingCard:    "bg-gradient-to-br from-amber-50/80 to-orange-50/60 border-slate-200 hover:border-amber-400/80 hover:shadow-amber-200/50 hover:shadow-2xl",
    pendingIcon:    "from-amber-400 to-orange-500",
    pendingLabel:   "border border-slate-200/50 text-slate-600 hover:bg-slate-50/60 backdrop-blur-sm",
    spinner:        "border-slate-200/50 border-t-indigo-500",
    emptyWrap:      "bg-slate-100/80 backdrop-blur-sm text-slate-500 border border-slate-200/50",
    emptyReset:     "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-200/50",
    errRow:         "bg-red-50/80 border-red-200/60 backdrop-blur-sm",
    errText:        themeT.danger,
    liveText:       themeT.success,
    liveDot:        "bg-emerald-500",
    // Analysis rows - Enhanced colors
    rowBase:        "bg-white/90 border border-slate-200/70 hover:border-indigo-400/80 hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-blue-50/40 hover:shadow-indigo-200/30 hover:shadow-xl backdrop-blur-sm transition-all duration-200",
    rowCode:        "text-indigo-600 font-bold tracking-wide",
    rowDate:        "text-slate-500 font-mono text-[13px]",
    rowBudget:      "text-slate-800 font-bold tracking-wide",
    rowBudgetLabel: "text-slate-500 font-semibold uppercase tracking-wider text-[11px]",
    rowScore:       "text-indigo-600 font-bold",
    rowNomLabel:    "text-slate-500 uppercase tracking-wider text-[11px]",
    rowNom:         "text-slate-900 font-semibold",
    rowJustLabel:   "text-slate-500 uppercase tracking-wider text-[11px] font-semibold",
    rowJust:        "text-slate-700 leading-relaxed",
  }

  const resetFilters = () => { setFilterDirection(""); setFilterRisque(""); setFilterReco("") }

  // ─── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${c.page} flex`}>
      <DGSidebar />

      <div className="flex-1 p-8 overflow-y-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shrink-0">
            <IconRobot size={26} className="text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${c.textMain} mb-1`}>
              Assistant IA — Budgets 2025
            </h1>
            <p className={`${c.textSub} text-sm max-w-2xl`}>
              Analyse automatique des demandes budgétaires avec recommandations IA. Chat contextuel et historique complet.
            </p>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        {!loadingHist && analyses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {KPI_CONFIG.map((cfg, i) => {
              const p = isDark ? cfg.dark : cfg.light
              return (
                <div key={i} className={`${c.card} border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
                  <div className={`h-1 w-full rounded-full bg-gradient-to-r ${p.bar} mb-4`} />
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${p.wrap} flex items-center justify-center`}>
                      <cfg.Icon size={17} className={p.icon} />
                    </div>
                    <IconTrendingUp size={13} className={p.trend} />
                  </div>
                  <p className={`text-2xl font-bold ${p.value} mb-0.5`}>
                    {stats[cfg.key].toLocaleString("fr-FR")}{cfg.suffix || ""}
                  </p>
                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${c.textSub}`}>
                    {cfg.label}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Directions en attente ── */}
        {!loadingDirections && directionsEnAttente.length > 0 && (
          <div className="mb-8">
            <h2 className={`${c.textMain} text-base font-bold mb-4 flex items-center gap-2`}>
              <IconClock size={17} className="text-amber-500" />
              Demandes en attente d'analyse IA
              <span className={`${c.textSub} text-xs font-normal`}>({directionsEnAttente.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {directionsEnAttente.map((d) => (
                <button
                  key={d._id}
                  onClick={() => navigate(`/dg/demandes/${d._id}`)}
                  className={`group ${c.pendingCard} border rounded-2xl p-5 hover:shadow-lg transition-all duration-200 text-left flex flex-col gap-3`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.pendingIcon} flex items-center justify-center shadow-md`}>
                    <span className="text-white font-bold text-sm">{d.code?.slice(0, 3)}</span>
                  </div>
                  <div>
                    <h4 className={`${c.textMain} font-semibold text-sm mb-0.5`}>{d.code}</h4>
                    <p className={`${c.textSub} text-xs mb-2`}>{d.totalDemande?.toLocaleString("fr-FR") ?? 0} DT</p>
                    <RiskBadge niveau="MOYEN" />
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <span className={`flex-1 text-center ${c.pendingLabel} text-xs py-1.5 px-3 rounded-lg font-semibold transition-colors`}>
                      Analyser
                    </span>
                    <span className={`px-3 py-1.5 ${c.btnPrimary} text-xs font-semibold rounded-lg shadow transition-all flex items-center gap-1`}>
                      Voir <IconArrowRight size={12} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Main 2-col grid ── */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">

          {/* ════ Analyses IA Récentes ════ */}
          <div className={`${c.card} border rounded-2xl shadow-sm flex flex-col max-h-[800px] overflow-hidden`}>

            {/* sticky header + filters */}
            <div className={`${c.cardHdr} border-b px-6 py-5 sticky top-0 z-10`}>
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <div>
                  <h2 className={`${c.textMain} text-lg font-bold`}>Analyses IA Récentes</h2>
                  <p className={`${c.textSub} text-xs mt-0.5`}>
                    {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} — cliquez pour les détails
                  </p>
                </div>
                {/* live indicator */}
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${c.liveText}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${c.liveDot} animate-pulse`} />
                  En direct
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                <input
                  value={filterDirection}
                  onChange={e => setFilterDirection(e.target.value)}
                  placeholder="Direction..."
                  className={`${c.input} px-3 py-2 text-xs flex-1 min-w-[100px]`}
                />
                <select
                  value={filterRisque}
                  onChange={e => setFilterRisque(e.target.value)}
                  className={`${c.select} px-3 py-2 text-xs`}
                >
                  <option value="">Tous risques</option>
                  <option value="ELEVE">Élevé</option>
                  <option value="MOYEN">Moyen</option>
                  <option value="FAIBLE">Faible</option>
                </select>
                <select
                  value={filterReco}
                  onChange={e => setFilterReco(e.target.value)}
                  className={`${c.select} px-3 py-2 text-xs`}
                >
                  <option value="">Toutes reco.</option>
                  <option value="APPROUVER">Approuver</option>
                  <option value="REJETER">Rejeter</option>
                </select>
                {(filterDirection || filterRisque || filterReco) && (
                  <button
                    onClick={resetFilters}
                    className={`px-3 py-2 text-xs rounded-xl font-semibold ${c.btnPrimary} shadow transition-all`}
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            {/* Analyses list body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              {/* Error */}
              {erreurHist && (
                <div className={`${c.errRow} border rounded-xl px-4 py-3 flex items-center gap-2`}>
                  <IconAlertCircle size={15} className={c.errText} />
                  <span className={`${c.errText} text-sm`}>{erreurHist}</span>
                </div>
              )}

              {/* Loading */}
              {loadingHist && (
                <div className="flex justify-center py-12">
                  <div className={`w-8 h-8 rounded-full border-2 ${c.spinner} animate-spin`} />
                </div>
              )}

              {/* Empty */}
              {!loadingHist && filtered.length === 0 && (
                <div className={`${c.emptyWrap} rounded-2xl p-10 text-center`}>
                  <IconInbox size={36} className={`mx-auto mb-3 ${c.textMuted}`} />
                  <p className={`text-sm font-semibold ${c.textSub} mb-1`}>Aucune analyse trouvée</p>
                  <p className={`text-xs ${c.textMuted} mb-4`}>Modifiez vos filtres ou lancez une première analyse.</p>
                  {(filterDirection || filterRisque || filterReco) && (
                    <button onClick={resetFilters} className={`${c.emptyReset} text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow`}>
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              )}

              {/* Rows */}
              {!loadingHist && filtered.map((a) => (
                <div
                  key={a._id}
                  className={`${c.rowBase} rounded-xl p-4 transition-all duration-150 cursor-pointer`}
                  onClick={() => navigate(`/dg/demandes/${a.directionId || a._id}`)}
                >
                  {/* Row top: code + date + badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm ${c.rowCode}`}>{a.directionCode}</span>
                      <RecoBadge value={a.recommandation} isDark={isDark} />
                      <RiskBadge niveau={a.risque?.toUpperCase()} />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] ${c.rowDate} tabular-nums`}>
                        {new Date(a.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); supprimerAnalyse(a._id) }}
                        className={`p-1.5 rounded-lg ${c.btnDanger} transition-colors`}
                        title="Supprimer"
                      >
                        <IconTrash size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mb-3">
                    <div className={`text-[10px] font-semibold uppercase tracking-wide ${c.rowBudgetLabel} mb-1`}>Score IA</div>
                    <ScoreBar score={a.score} isDark={isDark} />
                  </div>

                  {/* Budgets */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className={`text-[10px] uppercase tracking-wide font-semibold ${c.rowBudgetLabel}`}>Alloué</div>
                      <div className={`text-xs font-bold ${c.rowBudget} tabular-nums`}>
                        {(a.budgetAlloue || 0).toLocaleString("fr-FR")} <span className={`font-normal ${c.rowBudgetLabel}`}>DT</span>
                      </div>
                    </div>
                    <div>
                      <div className={`text-[10px] uppercase tracking-wide font-semibold ${c.rowBudgetLabel}`}>Demandé</div>
                      <div className={`text-xs font-bold ${c.rowBudget} tabular-nums`}>
                        {(a.budgetDemande || 0).toLocaleString("fr-FR")} <span className={`font-normal ${c.rowBudgetLabel}`}>DT</span>
                      </div>
                    </div>
                  </div>

                  {/* Nom direction */}
                  {a.nomDirection && (
                    <div className="mb-2">
                      <span className={`text-[10px] uppercase tracking-wide font-semibold ${c.rowNomLabel}`}>Direction : </span>
                      <span className={`text-xs ${c.rowNom}`}>{a.nomDirection}</span>
                    </div>
                  )}

                  {/* Justification */}
                  {a.justification && (
                    <p className={`text-[11px] leading-relaxed ${c.rowJust} line-clamp-2 mt-1`}>
                      <span className={`font-semibold ${c.rowJustLabel}`}>Justification : </span>
                      {a.justification}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ════ Chat IA ════ */}
          <div className={`${c.card} border rounded-2xl shadow-sm flex flex-col max-h-[800px] overflow-hidden`}>

            {/* Chat header */}
            <div className={`${c.cardHdr} border-b px-6 py-5 sticky top-0 z-10`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`${c.textMain} text-lg font-bold`}>Chat IA Budgétaire</h2>
                  <p className={`${c.textSub} text-xs mt-0.5`}>Posez vos questions sur les budgets 2025</p>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${c.liveText}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${c.liveDot} animate-pulse`} />
                  {loadingChat ? "Analyse..." : "Prêt"}
                </div>
              </div>
            </div>

            {/* Quick questions */}
            <div className={`px-4 pt-4 pb-2 flex gap-2 flex-wrap border-b ${c.divider}`}>
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => envoyerQuestion(null, q)}
                  className={`${c.quickBtn} text-xs px-3 py-1.5 rounded-xl font-medium`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${c.msgArea}`}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mr-2 mt-0.5 shrink-0 shadow-sm">
                      <IconRobot size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === "user" ? c.userBubble : c.botBubble}
                    ${msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loadingChat && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-sm">
                    <IconRobot size={14} className="text-white" />
                  </div>
                  <div className={`${c.botBubble} px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5`}>
                    {[0, 150, 300].map(d => (
                      <span key={d} className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-bounce`}
                        style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Error */}
            {erreurChat && (
              <div className={`mx-4 mb-2 ${c.errRow} border rounded-xl px-3 py-2 flex items-center gap-2`}>
                <IconAlertCircle size={14} className={c.errText} />
                <span className={`${c.errText} text-xs`}>{erreurChat}</span>
              </div>
            )}

            {/* Input */}
            <form onSubmit={envoyerQuestion} className={`p-4 border-t ${c.divider} flex gap-2`}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Posez votre question budgétaire..."
                disabled={loadingChat}
                className={`${c.input} flex-1 px-4 py-3 text-sm`}
              />
              <button
                type="submit"
                disabled={loadingChat || !question.trim()}
                className={`${c.btnPrimary} rounded-xl px-4 py-3 shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold`}
              >
                <IconSend size={15} />
                {loadingChat ? "..." : "Envoyer"}
              </button>
            </form>
          </div>

        </div>{/* end main grid */}
      </div>
    </div>
  )
}
