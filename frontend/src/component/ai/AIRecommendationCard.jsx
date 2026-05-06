// Carte Recommandation IA – Theme-aware
import { useEffect, useState } from "react"
import { useTheme } from "../../hooks/useTheme"
import RiskBadge from "./RiskBadge"

// ─── Score ring SVG ──────────────────────────────────────────────────────────
function ScoreRing({ score, isApprove, isDark }) {
  const pct  = Math.min(100, Math.max(0, score || 0))
  const r    = 32
  const circ = 2 * Math.PI * r               // ≈ 201
  const offset = circ - (circ * pct) / 100

  const trackStroke  = isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0"
  const fillStroke   = isApprove ? "#10b981" : "#ef4444"
  const numColor     = isApprove
    ? (isDark ? "text-emerald-300" : "text-emerald-600")
    : (isDark ? "text-red-300"     : "text-red-600")

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke={trackStroke} strokeWidth="6" />
        <circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke={fillStroke}
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-[22px] font-extrabold font-mono leading-none ${numColor}`}>
          {pct}
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-500 mt-0.5">
          / 100
        </span>
      </div>
    </div>
  )
}

// ─── Section label ───────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <p className="text-[9px] font-bold uppercase tracking-[.1em] text-slate-500 mb-1.5">
      {children}
    </p>
  )
}

// ─── Score bar ───────────────────────────────────────────────────────────────
function ScoreBar({ score, isApprove, isDark }) {
  const pct = Math.min(100, Math.max(0, score || 0))
  return (
    <div>
      <Label>Score IA</Label>
      <div className={`h-[5px] rounded-full overflow-hidden ${isDark ? "bg-white/[.07]" : "bg-slate-200"}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            isApprove ? "bg-emerald-500" : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
        <span>0</span><span>50</span><span>100</span>
      </div>
    </div>
  )
}

// ─── Facteur row ─────────────────────────────────────────────────────────────
function FacteurRow({ facteur, isDark }) {
  const { impact, detail } = facteur
  const isPos = impact === "positif"
  const isNeg = impact === "negatif"

  const rowBg = isDark
    ? isPos ? "bg-emerald-950/30 border-emerald-800/20"
      : isNeg ? "bg-red-950/30 border-red-800/20"
      : "bg-white/[.03] border-white/[.06]"
    : isPos ? "bg-emerald-50 border-emerald-100"
      : isNeg ? "bg-red-50 border-red-100"
      : "bg-slate-50 border-slate-100"

  const dotColor = isPos ? "bg-emerald-500" : isNeg ? "bg-red-500" : "bg-slate-400"

  const impactColor = isDark
    ? isPos ? "text-emerald-400" : isNeg ? "text-red-400" : "text-slate-500"
    : isPos ? "text-emerald-700" : isNeg ? "text-red-700" : "text-slate-500"

  const impactLabel = isPos ? "Impact positif" : isNeg ? "Impact négatif" : "Neutre"

  const detailColor = isDark ? "text-slate-400" : "text-slate-600"

  return (
    <div className={`flex items-start gap-2.5 p-2.5 rounded-[10px] border transition-all duration-200 hover:scale-[1.01] ${rowBg}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${dotColor}`} />
      <div>
        <p className={`text-[12px] leading-relaxed ${detailColor}`}>{detail}</p>
        <span className={`text-[9px] font-bold uppercase tracking-[.08em] ${impactColor}`}>
          {impactLabel}
        </span>
      </div>
    </div>
  )
}

// ─── Main Card ───────────────────────────────────────────────────────────────
export default function AIRecommendationCard({ analyse }) {
  const { isDark } = useTheme()
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 60)
    return () => clearTimeout(t)
  }, [])

  if (!analyse) return null

  const { recommandation, score, risque, justification, facteurs } = analyse
  const isApprove = recommandation === "APPROUVER"

  // ── Semantic color tokens ─────────────────────────────────────────────────
  const accent = isApprove
    ? { pill: isDark ? "bg-emerald-950/50 border-emerald-700/30" : "bg-emerald-50 border-emerald-200",
        dot:  "bg-emerald-500",
        label:isDark ? "text-emerald-300" : "text-emerald-800",
        area: isDark ? "bg-emerald-950/20 border-emerald-800/15" : "bg-emerald-50/60 border-emerald-200/60",
        just: isDark ? "bg-emerald-950/30 border-emerald-800/20" : "bg-emerald-50 border-emerald-100",
        chip: isDark ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/30" : "bg-emerald-100 text-emerald-800 border-emerald-200",
      }
    : { pill: isDark ? "bg-red-950/50 border-red-700/30"     : "bg-red-50 border-red-200",
        dot:  "bg-red-500",
        label:isDark ? "text-red-300"     : "text-red-800",
        area: isDark ? "bg-red-950/20 border-red-800/15"     : "bg-red-50/60 border-red-200/60",
        just: isDark ? "bg-red-950/30 border-red-800/20"     : "bg-red-50 border-red-100",
        chip: isDark ? "bg-red-900/40 text-red-300 border-red-700/30" : "bg-red-100 text-red-800 border-red-200",
      }

  const cardBorder = isDark
    ? isApprove ? "border-emerald-800/25" : "border-red-800/25"
    : isApprove ? "border-emerald-200/70" : "border-red-200/70"

  const cardBg = isDark
    ? isApprove ? "bg-[#0c1a14]" : "bg-[#1a0e0e]"
    : isApprove ? "bg-[#f6fefb]" : "bg-[#fff8f8]"

  const divider  = isDark ? "border-white/[.06]" : "border-black/[.06]"
  const justText = isDark ? "text-slate-400" : "text-slate-600"

  return (
    <div className={`rounded-2xl border p-[22px] transition-all duration-300 ${cardBg} ${cardBorder}`}>

      {/* ── Verdict header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${accent.pill}`}>
          <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${accent.dot}`} />
          <span className={`text-[11px] font-bold uppercase tracking-[.1em] ${accent.label}`}>
            {recommandation}
          </span>
        </div>
        <RiskBadge niveau={risque} />
      </div>

      {/* ── Score area ──────────────────────────────────────────────────── */}
      <div className={`flex items-center gap-4 p-4 rounded-xl border mb-5 ${accent.area}`}>
        <ScoreRing score={animated ? score : 0} isApprove={isApprove} isDark={isDark} />
        <div className="flex-1">
          <ScoreBar score={animated ? score : 0} isApprove={isApprove} isDark={isDark} />
        </div>
      </div>

      {/* ── Justification ───────────────────────────────────────────────── */}
      <div className={`p-4 rounded-[10px] border mb-5 ${accent.just}`}>
        <div className="flex items-center gap-2 mb-2.5">
          <span className={`text-[9px] font-extrabold uppercase tracking-[.1em] px-2 py-0.5 rounded-full border ${accent.chip}`}>
            IA
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[.07em] text-slate-500">
            Justification
          </span>
        </div>
        <p className={`text-[12px] leading-[1.7] ${justText}`}>
          {justification}
        </p>
      </div>

      {/* ── Facteurs ────────────────────────────────────────────────────── */}
      {facteurs && facteurs.length > 0 && (
        <div>
          <div className={`border-t ${divider} mb-4`} />
          <Label>Facteurs d'analyse</Label>
          <div className="space-y-2">
            {facteurs.map((f, i) => (
              <FacteurRow key={i} facteur={f} isDark={isDark} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}