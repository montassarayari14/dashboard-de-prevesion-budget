
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../hooks/useTheme"
import RiskBadge from "../ai/RiskBadge"
import Ecartpill from "./Ecartpill"
import Statutbadge from "./Statutbadge"
// Icons defined inline below

// ScoreBar component (extracted from AIAssistant)
function ScoreBar({ score, isDark }) {
  const pct = Math.min(100, Math.max(0, score || 0))
  const color = pct >= 70 ? (isDark ? "from-emerald-500 to-teal-400" : "from-emerald-500 to-teal-400")
    : pct >= 40 ? (isDark ? "from-orange-500 to-amber-400" : "from-orange-500 to-amber-400")
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

// RecoBadge (extracted)
function RecoBadge({ value, isDark }) {
  if (value === "APPROUVER") return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ring-1 ring-inset
      ${isDark ? "bg-emerald-900/70 text-emerald-200 border border-emerald-700/80 ring-emerald-800/30" : "bg-emerald-100/90 text-emerald-800 border border-emerald-300/70 ring-emerald-200/50"}`}>
✓ Approuver
    </span>
  )
  if (value === "REJETER") return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ring-1 ring-inset
      ${isDark ? "bg-red-900/70 text-red-200 border border-red-700/80 ring-red-800/30" : "bg-red-100/90 text-red-800 border border-red-300/70 ring-red-200/50"}`}>
✗ Rejeter
    </span>
  )
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold
      ${isDark ? "bg-slate-800/60 text-slate-300 border border-slate-700/70" : "bg-slate-100/80 text-slate-700 border border-slate-200/60"}`}>
      —
    </span>
  )
}

// Main Card
export default function DemandesAICard({ direction }) {
  const navigate = useNavigate()
  const { t, isDark } = useTheme()

  const analyse = direction.latestAnalyse || {} // Assume backend populates
  const score = analyse.score || 0
  const marge = direction.budget - direction.totalDemande || 0

  const c = isDark ? {
    // Copy from AIAssistant.jsx dark theme
    rowBase: "bg-slate-800/60 border border-slate-700/70 hover:border-indigo-500/60 hover:bg-slate-800/80 hover:shadow-indigo-900/20 hover:shadow-lg backdrop-blur-sm transition-all duration-200",
    rowCode: "text-indigo-300 font-bold tracking-wide",
    rowDate: "text-slate-400 font-mono text-[13px]",
    rowBudget: "text-slate-200 font-bold tracking-wide",
    rowBudgetLabel: "text-slate-400 font-semibold uppercase tracking-wider text-[11px]",
    rowScore: "text-indigo-300 font-bold",
    rowNomLabel: "text-slate-400 uppercase tracking-wider text-[11px]",
    rowNom: "text-slate-100 font-semibold",
    rowJustLabel: "text-slate-400 uppercase tracking-wider text-[11px] font-semibold",
    rowJust: "text-slate-300 leading-relaxed",
    textMain: "text-slate-50 font-semibold",
    textSub: "text-slate-300",
    textMuted: "text-slate-500",
    // ... add more as needed
  } : {
    // light theme
    rowBase: "bg-white/90 border border-slate-200/70 hover:border-indigo-400/80 hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-blue-50/40 hover:shadow-indigo-200/30 hover:shadow-xl backdrop-blur-sm transition-all duration-200",
    // ... etc
  }

  return (
    <div className={`${c.rowBase} rounded-xl p-4 cursor-pointer`} onClick={() => navigate(`/dg/demandes/${direction._id}`)}>
      {/* Top: code + badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm ${c.rowCode}`}>{direction.code}</span>
          <Statutbadge statut={direction.statut} />
          {analyse.risque && <RiskBadge niveau={analyse.risque} />}
          <RecoBadge value={analyse.recommandation} isDark={isDark} />
        </div>
        <span className={`${c.rowDate} tabular-nums`}>
          {direction.soumisLe ? new Date(direction.soumisLe).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—"}
        </span>
      </div>

      {/* Score */}
      {analyse.score !== undefined && (
        <div className="mb-3">
          <div className={`text-[10px] font-semibold uppercase tracking-wide ${c.rowBudgetLabel} mb-1`}>Score IA</div>
          <ScoreBar score={score} isDark={isDark} />
        </div>
      )}

      {/* Budgets */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <div className={`text-[10px] uppercase tracking-wide font-semibold ${c.rowBudgetLabel}`}>Alloué</div>
          <div className={`text-xs font-bold ${c.rowBudget} tabular-nums`}>
            {direction.budget?.toLocaleString("fr-FR") || 0} <span className={c.rowBudgetLabel}>DT</span>
          </div>
        </div>
        <div>
          <div className={`text-[10px] uppercase tracking-wide font-semibold ${c.rowBudgetLabel}`}>Demandé</div>
          <div className={`text-xs font-bold ${c.rowBudget} tabular-nums`}>
            {direction.totalDemande?.toLocaleString("fr-FR") || 0} <span className={c.rowBudgetLabel}>DT</span>
          </div>
        </div>
      </div>
      <Ecartpill demande={direction.totalDemande} alloue={direction.budget} small />

      {/* Preview justif */}
      {analyse.justification && (
        <p className={`text-[11px] leading-relaxed ${c.rowJust} line-clamp-2 mt-2`}>
          <span className={`${c.rowJustLabel}`}>IA: </span>
          {analyse.justification}
        </p>
      )}

      {/* Action */}
      <div className="flex items-center justify-end mt-3 pt-2 border-t border-slate-700/50">
        <span className="text-xs text-slate-400 mr-2">Détail</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
  <line x1="5" y1="12" x2="19" y2="12" />
  <polyline points="12 5 19 12 12 19" />
</svg>
      </div>
    </div>
  )
}

