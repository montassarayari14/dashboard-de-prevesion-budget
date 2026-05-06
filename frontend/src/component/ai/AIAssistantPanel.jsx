// Panneau principal Assistant IA DG – Design premium, sans emojis

import { useState } from "react"
import { useTheme } from "../../hooks/useTheme"
import API from "../../api/axios"
import AIRecommendationCard from "./AIRecommendationCard"
import BudgetAnalysisMetrics from "./BudgetAnalysisMetrics"
import RiskBadge from "./RiskBadge"

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconBrain = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
)
const IconChevronDown = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)
const IconPlay = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)
const IconAlertTriangle = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const IconCheckCircle = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)
const IconXCircle = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)
const IconStar = ({ size = 13, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconTable = ({ size = 13, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18" />
  </svg>
)
const IconLightbulb = ({ size = 13, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6M10 22h4" />
  </svg>
)
const IconBarChart = ({ size = 13, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
)

// ─── Palette tokens ───────────────────────────────────────────────────────────
function useColors(isDark) {
  return isDark ? {
    // Shell
    shell:        "bg-[#0c1428] border border-[#1e3a6e]/60 shadow-2xl shadow-[#060d1f]/80",
    // Header
    header:       "bg-[#0f1d3d]/90 border-b border-[#1e3a6e]/50 hover:bg-[#13224a]/90",
    iconRing:     "bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] border border-[#3b5fa0]/50 shadow-lg shadow-blue-950/50",
    title:        "text-[#93c5fd]",
    titleAccent:  "text-[#60a5fa]",
    subtitle:     "text-[#4a7ab5]",
    dot:          "bg-emerald-400 shadow-sm shadow-emerald-400/60",
    chevronWrap:  "bg-[#1a2f5a]/70 border border-[#2a4a80]/40 group-hover:border-[#3b6bb0]/60 group-hover:bg-[#1e3a6e]/50",
    chevron:      "text-[#4a7ab5]",
    // Body
    body:         "bg-[#0c1428]",
    // CTA section
    ctaWrap:      "bg-[#0f1d3d]/60 border border-[#1e3a6e]/40 rounded-2xl",
    ctaCircle:    "bg-[#1a3060]/80 border-2 border-[#2a50a0]/50 shadow-inner",
    ctaCircleText:"text-[#60a5fa]",
    ctaDesc:      "text-[#4a7ab5]",
    btn:          "bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] hover:from-[#1e40af] hover:to-[#1d4ed8] shadow-lg shadow-blue-900/60 hover:shadow-blue-800/80 text-white border border-blue-600/40",
    btnIcon:      "bg-white/10",
    // Loading
    pingRing:     "border-2 border-[#3b6bb0]/40 animate-spin",
    pingRing2:    "border-2 border-[#1e3a6e]/30 animate-spin",
    pingCenter:   "text-[#60a5fa]",
    loadTitle:    "text-[#93c5fd]",
    loadSub:      "text-[#3a5a8a]",
    // Error
    errWrap:      "bg-[#200a0a] border border-[#7f1d1d]/60 text-[#fca5a5]",
    errIconWrap:  "bg-[#7f1d1d]/40 text-[#fca5a5]",
    // Section cards
    secCard:      "bg-[#0f1d3d]/50 border border-[#1e3a6e]/40 rounded-2xl",
    secLabel:     "bg-[#1e3a6e]/60 text-[#93c5fd] border border-[#2a4a90]/40",
    secTitle:     "text-[#60a5fa]",
    // Table
    thText:       "text-[#3b6bb0]",
    tdBorder:     "border-[#1e3a6e]/40",
    rowHover:     "hover:bg-[#1a3060]/40",
    catPill:      "bg-[#1a3060]/80 text-[#7eb3f5] border border-[#2a5090]/40",
    tdMono:       "text-[#a5c8f8]",
    cellText:     "text-[#7eb3f5]",
    cellMuted:    "text-[#3a5a8a]",
    okBadge:      "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50",
    warnBadge:    "bg-amber-900/40 text-amber-300 border border-amber-700/50",
    // Suggestions
    suggCard:     "bg-[#0a1f3d]/60 border border-[#1a3a7a]/50 rounded-2xl",
    suggLabel:    "bg-[#1a3a7a]/60 text-[#60a5fa] border border-[#2a5090]/40",
    suggTitle:    "text-[#60a5fa]",
    suggRow:      "bg-[#0f2050]/50 border border-[#1e3a6e]/30 text-[#93c5fd] hover:border-[#2a5090]/70 hover:bg-[#152860]/60",
    suggNum:      "bg-[#1e3a8a]/80 text-[#93c5fd] border border-[#2a5090]/50",
    // Footer
    footerBorder: "border-[#1e3a6e]/40",
    footerText:   "text-[#3a5a8a]",
    scoreOk:      "bg-emerald-900/50 text-emerald-300 border border-emerald-700/40",
    scoreErr:     "bg-rose-900/50 text-rose-300 border border-rose-700/40",
    // Status (disabled)
    disabledCard: "bg-[#0c1428] border border-[#1e3a6e]/40 shadow-xl shadow-[#060d1f]/60",
    disabledText: "text-[#3a5a8a]",
  } : {
    // Shell
    shell:        "bg-white border border-blue-100 shadow-xl shadow-blue-100/60",
    // Header
    header:       "bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100 hover:from-blue-100/70 hover:to-sky-100/70",
    iconRing:     "bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/40 shadow-lg shadow-blue-200/60",
    title:        "text-blue-900",
    titleAccent:  "text-blue-600",
    subtitle:     "text-blue-400",
    dot:          "bg-emerald-500 shadow-sm shadow-emerald-400/50",
    chevronWrap:  "bg-white/80 border border-blue-200/70 group-hover:border-blue-400/60 group-hover:bg-blue-50/80",
    chevron:      "text-blue-400",
    // Body
    body:         "bg-gradient-to-b from-blue-50/30 to-white",
    // CTA section
    ctaWrap:      "bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200/60 rounded-2xl",
    ctaCircle:    "bg-white border-2 border-blue-200 shadow-md shadow-blue-100/60",
    ctaCircleText:"text-blue-500",
    ctaDesc:      "text-blue-400",
    btn:          "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-300/60 hover:shadow-blue-400/70 text-white border border-blue-500/30",
    btnIcon:      "bg-white/20",
    // Loading
    pingRing:     "border-2 border-blue-400/50 animate-spin",
    pingRing2:    "border-2 border-indigo-300/30 animate-spin",
    pingCenter:   "text-blue-600",
    loadTitle:    "text-blue-700",
    loadSub:      "text-blue-300",
    // Error
    errWrap:      "bg-red-50 border border-red-200 text-red-700",
    errIconWrap:  "bg-red-100 text-red-600",
    // Section cards
    secCard:      "bg-white border border-blue-100/80 rounded-2xl shadow-sm shadow-blue-100/40",
    secLabel:     "bg-blue-100 text-blue-700 border border-blue-200/60",
    secTitle:     "text-blue-700",
    // Table
    thText:       "text-blue-400",
    tdBorder:     "border-blue-100/80",
    rowHover:     "hover:bg-blue-50/70",
    catPill:      "bg-indigo-50 text-indigo-600 border border-indigo-200/60",
    tdMono:       "text-indigo-700",
    cellText:     "text-slate-700",
    cellMuted:    "text-slate-400",
    okBadge:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warnBadge:    "bg-amber-50 text-amber-700 border border-amber-200",
    // Suggestions
    suggCard:     "bg-sky-50/80 border border-sky-200/60 rounded-2xl shadow-sm",
    suggLabel:    "bg-sky-100 text-sky-700 border border-sky-200/60",
    suggTitle:    "text-sky-700",
    suggRow:      "bg-white border border-sky-100 text-slate-700 hover:border-sky-300/80 hover:bg-sky-50/60",
    suggNum:      "bg-sky-100 text-sky-700 border border-sky-200/60",
    // Footer
    footerBorder: "border-blue-100",
    footerText:   "text-blue-300",
    scoreOk:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    scoreErr:     "bg-rose-50 text-rose-700 border border-rose-200",
    // Status (disabled)
    disabledCard: "bg-white border border-blue-100 shadow-md shadow-blue-50/60",
    disabledText: "text-blue-300",
  }
}

// ─── Score bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score, isDark }) {
  const pct = Math.min(100, Math.max(0, score || 0))
  const gradient = pct >= 70
    ? "from-emerald-500 to-teal-400"
    : pct >= 40
      ? "from-amber-500 to-orange-400"
      : "from-red-500 to-rose-400"
  const trackColor = isDark ? "bg-[#1a3060]/60" : "bg-blue-100"
  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 h-2 rounded-full ${trackColor} overflow-hidden`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums min-w-[32px] text-right ${isDark ? "text-[#93c5fd]" : "text-blue-700"}`}>
        {pct}
      </span>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, label, title, c }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${c.secLabel}`}>
        <Icon size={13} />
      </div>
      <span className={`text-xs font-bold uppercase tracking-widest ${c.secTitle}`}>{label}</span>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AIAssistantPanel({ direction }) {
  const { isDark } = useTheme()
  const c = useColors(isDark)

  const [analyse, setAnalyse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expanded, setExpanded] = useState(true)

  async function lancerAnalyse() {
    if (!direction?._id) return
    setLoading(true)
    setError("")
    try {
      const res = await API.post(`/ai/analyze/${direction._id}`)
      const analyseResult = res.data.data.analyseResult || {}
      setAnalyse({
        ...analyseResult,
        totalDemande: analyseResult.totalDemande ?? analyseResult.budgetDemande ?? 0,
        postesAnalyse: res.data.data.postesAnalyse || [],
      })
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'analyse IA")
    } finally {
      setLoading(false)
    }
  }

  // ─── Statut non "en_attente" ──────────────────────────────────────────────
  if (direction?.statut !== "en_attente") {
    const statusMsg = direction?.statut === "approuve"
      ? "Cette demande a déjà été approuvée."
      : direction?.statut === "rejete"
      ? "Cette demande a été rejetée."
      : "Aucune analyse disponible pour ce statut."

    return (
      <div className={`${c.disabledCard} rounded-2xl p-5 mb-5`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.iconRing}`}>
            <IconBrain size={18} className="text-white" />
          </div>
          <div>
            <p className={`text-sm font-semibold ${c.title}`}>Assistant IA</p>
            <p className={`text-xs mt-0.5 ${c.disabledText}`}>{statusMsg}</p>
          </div>
        </div>
      </div>
    )
  }

  // ─── Panneau principal ────────────────────────────────────────────────────
  return (
    <div className={`${c.shell} rounded-2xl mb-5 overflow-hidden`}>

      {/* ── En-tête ── */}
      <div
        className={`px-5 py-4 flex items-center justify-between cursor-pointer group transition-all duration-200 ${c.header}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.iconRing}`}>
            <IconBrain size={19} className="text-white" />
          </div>

          {/* Titles */}
          <div>
            <div className="flex items-baseline gap-2">
              <p className={`text-sm font-bold tracking-tight ${c.title}`}>
                Assistant IA
              </p>
              <span className={`text-xs font-semibold ${c.titleAccent}`}>
                — Aide à la décision
              </span>
            </div>
            <div className={`flex items-center gap-2 mt-1 ${c.subtitle}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${c.dot}`} />
              <span className="text-xs">Analyse hybride · règles métier + IA</span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {analyse && <RiskBadge niveau={analyse.risque} />}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${c.chevronWrap}`}>
            <IconChevronDown
              size={15}
              className={`transition-transform duration-300 ${c.chevron} ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* ── Corps ── */}
      {expanded && (
        <div className={`${c.body} p-6 space-y-5`}>

          {/* ── CTA (pas encore analysé) ── */}
          {!analyse && !loading && !error && (
            <div className={`${c.ctaWrap} p-8 text-center`}>
              {/* Animated rings */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${isDark ? "bg-blue-500" : "bg-blue-300"}`} />
                <div className={`absolute inset-0 rounded-full ${c.ctaCircle} flex items-center justify-center`}>
                  <IconBrain size={32} className={c.ctaCircleText} />
                </div>
              </div>
              <p className={`text-sm font-semibold mb-1 ${isDark ? "text-[#93c5fd]" : "text-blue-700"}`}>
                Prêt pour l'analyse
              </p>
              <p className={`text-xs mb-7 max-w-xs mx-auto leading-relaxed ${c.ctaDesc}`}>
                Lancer une analyse complète de cette demande de budget avec l'intelligence artificielle
              </p>
              <button
                onClick={lancerAnalyse}
                className={`inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${c.btn}`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${c.btnIcon}`}>
                  <IconPlay size={11} />
                </span>
                Analyser ce budget
              </button>
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div className="text-center py-14">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className={`absolute inset-0 rounded-full border-[3px] ${c.pingRing}`}
                  style={{ animationDuration: "1.4s" }} />
                <div className={`absolute inset-3 rounded-full border-[2px] ${c.pingRing2}`}
                  style={{ animationDirection: "reverse", animationDuration: "2s" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconBrain size={22} className={c.pingCenter} />
                </div>
              </div>
              <p className={`text-sm font-semibold mb-1.5 ${c.loadTitle}`}>
                L'IA analyse les données budgétaires…
              </p>
              <p className={`text-xs ${c.loadSub}`}>Cette opération peut prendre quelques secondes</p>
            </div>
          )}

          {/* ── Erreur ── */}
          {error && (
            <div className={`rounded-xl p-4 flex items-center gap-3 ${c.errWrap}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.errIconWrap}`}>
                <IconAlertTriangle size={15} />
              </div>
              <p className="text-sm leading-relaxed">{error}</p>
            </div>
          )}

          {/* ── Résultats ── */}
          {analyse && !loading && (
            <div className="space-y-5">

              {/* Score global bar */}
              <div className={`${c.secCard} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold uppercase tracking-widest ${c.secTitle}`}>
                    Score global
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${analyse.score >= 50 ? c.scoreOk : c.scoreErr}`}>
                    {analyse.score}/100
                  </span>
                </div>
                <ScoreBar score={analyse.score} isDark={isDark} />
              </div>

              {/* Métriques */}
              <div className={`${c.secCard} p-5`}>
                <SectionHeader icon={IconBarChart} label="Métriques analysées" c={c} />
                <BudgetAnalysisMetrics analyse={analyse} />
              </div>

              {/* Recommandation IA */}
              <AIRecommendationCard analyse={analyse} />

              {/* Tableau des postes */}
              {analyse.postesAnalyse?.length > 0 && (
                <div className={`${c.secCard} p-5 overflow-hidden`}>
                  <SectionHeader icon={IconTable} label="Analyse des postes" c={c} />
                  <div className="overflow-x-auto rounded-xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`text-[11px] uppercase tracking-wider border-b ${c.thText} ${c.tdBorder}`}>
                          <th className="px-4 py-2.5 text-left font-semibold">Poste</th>
                          <th className="px-4 py-2.5 text-left font-semibold">Catégorie</th>
                          <th className="px-4 py-2.5 text-right font-semibold">Montant</th>
                          <th className="px-4 py-2.5 text-left font-semibold">Statut</th>
                          <th className="px-4 py-2.5 text-left font-semibold">Commentaire</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-transparent">
                        {analyse.postesAnalyse.map((p, i) => (
                          <tr
                            key={i}
                            className={`border-b last:border-b-0 transition-colors ${c.tdBorder} ${c.rowHover}`}
                          >
                            <td className={`px-4 py-3 font-medium ${c.cellText}`}>{p.nom}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${c.catPill}`}>
                                {p.categorie}
                              </span>
                            </td>
                            <td className={`px-4 py-3 text-right font-mono text-xs font-bold ${c.tdMono}`}>
                              {p.montant.toLocaleString("fr-FR")} DT
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${p.anomalie ? c.warnBadge : c.okBadge}`}>
                                {p.anomalie
                                  ? <><IconXCircle size={11} /> Alerte</>
                                  : <><IconCheckCircle size={11} /> OK</>
                                }
                              </span>
                            </td>
                            <td className={`px-4 py-3 text-xs ${c.cellMuted}`}>
                              {p.anomalie ? p.commentaire : "Conforme"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {analyse.suggestions?.length > 0 && (
                <div className={`${c.suggCard} p-5`}>
                  <SectionHeader icon={IconLightbulb} label="Suggestions de l'IA" c={c} />
                  <ul className="space-y-2">
                    {analyse.suggestions.map((s, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm leading-relaxed transition-all duration-150 ${c.suggRow}`}
                      >
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border ${c.suggNum}`}>
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className={`flex items-center justify-between pt-4 border-t ${c.footerBorder}`}>
                <p className={`text-[11px] ${c.footerText}`}>
                  Source : {analyse.justificationLLM ? "Hybride (règles + LLM)" : "Rule-based uniquement"}
                </p>
                <div className="flex items-center gap-2">
                  <IconStar size={11} className={isDark ? "text-[#3a5a8a]" : "text-blue-300"} />
                  <span className={`text-[11px] ${c.footerText}`}>Score final :</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${analyse.score >= 50 ? c.scoreOk : c.scoreErr}`}>
                    {analyse.score}/100
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  )
}
