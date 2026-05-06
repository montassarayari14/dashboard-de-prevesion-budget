// Métriques budget IA – Design amélioré + calculs corrigés
import { useEffect, useState } from "react"
import { useTheme } from "../../hooks/useTheme"

// ─── Constantes de seuil ─────────────────────────────────────────────────────
const TAUX_DANGER  = 100   // dépassement
const TAUX_WARNING = 80    // attention
const ECART_ALERT  = 30    // écart N-1 significatif

// ─── Helpers couleur ─────────────────────────────────────────────────────────
function tauxColor(taux, isDark) {
  if (taux > TAUX_DANGER)  return isDark ? "text-red-300"     : "text-red-600"
  if (taux > TAUX_WARNING) return isDark ? "text-amber-300"   : "text-amber-700"
  return                          isDark ? "text-emerald-300" : "text-emerald-700"
}

function tauxFill(taux) {
  if (taux > TAUX_DANGER)  return "bg-red-500"
  if (taux > TAUX_WARNING) return "bg-amber-500"
  return                          "bg-emerald-500"
}

function tauxStroke(taux) {
  if (taux > TAUX_DANGER)  return "#ef4444"
  if (taux > TAUX_WARNING) return "#f59e0b"
  return                          "#10b981"
}

// ─── Label muted ─────────────────────────────────────────────────────────────
function Label({ children, isDark, alert }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <span className={`text-[9px] font-bold uppercase tracking-[.1em] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
        {children}
      </span>
      {alert && (
        <span className={`w-[6px] h-[6px] rounded-full animate-pulse ${isDark ? "bg-amber-400" : "bg-amber-500"}`} />
      )}
    </div>
  )
}

// ─── Barre de progression (avec width correct) ───────────────────────────────
function ProgressBar({ pct, fillClass, isDark, animated }) {
  const clampedPct = Math.min(100, Math.max(0, pct))
  return (
    <div className={`h-[4px] rounded-full overflow-hidden ${isDark ? "bg-white/[.06]" : "bg-slate-100"}`}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${fillClass}`}
        style={{ width: animated ? `${clampedPct}%` : "0%" }}
      />
    </div>
  )
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, valueClass, fillClass, barPct, alert, isDark, animated }) {
  const cardBg = isDark ? "bg-[#141d2e]" : "bg-white"
  const border  = isDark
    ? alert ? "border-red-800/40 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.1)]" : "border-white/[.07]"
    : alert ? "border-red-300/60" : "border-slate-200/70"

  return (
    <div className={`relative rounded-xl border p-4 transition-all duration-200 hover:scale-[1.015] ${cardBg} ${border}`}>
      <Label isDark={isDark} alert={alert}>{label}</Label>
      <p className={`text-[17px] font-extrabold font-mono tracking-tight mb-2.5 ${valueClass}`}>
        {value}
        {unit && (
          <span className={`text-[9px] font-bold uppercase tracking-wide ml-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
            {unit}
          </span>
        )}
      </p>
      <ProgressBar pct={barPct} fillClass={fillClass} isDark={isDark} animated={animated} />
    </div>
  )
}

// ─── Ring de synthèse ────────────────────────────────────────────────────────
function SummaryRing({ taux, isDark, animated }) {
  const r     = 28
  const circ  = 2 * Math.PI * r           // ≈ 175.9
  // On borne à 100 pour l'affichage visuel du ring (le chiffre réel s'affiche au centre)
  const pct   = Math.min(100, Math.max(0, taux))
  const offset = circ - (circ * pct) / 100

  const stroke = tauxStroke(taux)
  const track  = isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"
  const numCls = tauxColor(taux, isDark)

  return (
    <div className="relative w-[72px] h-[72px] flex-shrink-0">
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke={track} strokeWidth="5" />
        <circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={animated ? offset : circ}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-[13px] font-extrabold font-mono leading-none ${numCls}`}>
          {taux}%
        </span>
        <span className="text-[8px] font-bold uppercase tracking-wide text-slate-500 mt-0.5">
          taux
        </span>
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function BudgetAnalysisMetrics({ analyse }) {
  const { isDark } = useTheme()
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setAnimated(false)
    const t = setTimeout(() => setAnimated(true), 60)
    return () => clearTimeout(t)
  }, [analyse])

  if (!analyse) return null

  // ── Calculs ────────────────────────────────────────────────────────────────
  const budgetAlloue  = analyse.budgetAlloue  || 0
  const budgetDemande = analyse.budgetDemande ?? analyse.totalDemande ?? 0
  const budgetN1      = analyse.budgetN1      || 0
  const totalDemandeN1 = analyse.totalDemandeN1 || 0

  // Taux de consommation : (demandé / alloué) × 100, arrondi à l'entier
  const tauxConsommation = budgetAlloue > 0
    ? Math.round((budgetDemande / budgetAlloue) * 100)
    : 0

  const margeDisponible = budgetAlloue - budgetDemande
  const margeEstPositive = margeDisponible >= 0

  // Barre taux : 100 % visuellement = dépassement complet
  const tauxBarPct = Math.min(100, tauxConsommation)

  // Barre marge : proportion de marge restante dans le budget alloué
  const margeBarPct = budgetAlloue > 0
    ? Math.min(100, Math.max(0, Math.abs(margeDisponible) / budgetAlloue * 100))
    : 0

  // Écart N-1 optionnel
  const hasN1 = budgetN1 > 0 && totalDemandeN1 > 0
  const ecartN1 = hasN1
    ? Math.round(((budgetDemande - totalDemandeN1) / totalDemandeN1) * 100)
    : null

  // ── Tokens communs ─────────────────────────────────────────────────────────
  const blueCls  = isDark ? "text-indigo-300"  : "text-indigo-600"
  const amberCls = isDark ? "text-amber-300"   : "text-amber-700"
  const margeCls = margeEstPositive ? tauxColor(0, isDark) : tauxColor(110, isDark)
  const margeFill = margeEstPositive ? "bg-emerald-500" : "bg-red-500"
  const divider  = isDark ? "border-white/[.06]" : "border-slate-100"

  const summaryBg = isDark ? "bg-[#141d2e] border-white/[.07]" : "bg-white border-slate-200/70"

  return (
    <div className="space-y-2.5">

      {/* ── Grille 2×2 (+ N-1 pleine largeur si dispo) ──────────────────── */}
      <div className="grid grid-cols-2 gap-2.5">

        <StatCard
          label="Budget alloué"
          value={budgetAlloue.toLocaleString("fr-FR")}
          unit="DT"
          valueClass={blueCls}
          fillClass="bg-indigo-500"
          barPct={100}
          isDark={isDark}
          animated={animated}
        />

        <StatCard
          label="Demande soumise"
          value={budgetDemande.toLocaleString("fr-FR")}
          unit="DT"
          valueClass={amberCls}
          fillClass="bg-amber-500"
          barPct={tauxBarPct}
          isDark={isDark}
          animated={animated}
        />

        <StatCard
          label="Taux de consommation"
          value={`${tauxConsommation}%`}
          valueClass={tauxColor(tauxConsommation, isDark)}
          fillClass={tauxFill(tauxConsommation)}
          barPct={tauxBarPct}
          alert={tauxConsommation > TAUX_WARNING}
          isDark={isDark}
          animated={animated}
        />

        <StatCard
          label="Marge disponible"
          value={
            margeEstPositive
              ? margeDisponible.toLocaleString("fr-FR")
              : `−${Math.abs(margeDisponible).toLocaleString("fr-FR")}`
          }
          unit="DT"
          valueClass={margeCls}
          fillClass={margeFill}
          barPct={margeBarPct}
          alert={!margeEstPositive}
          isDark={isDark}
          animated={animated}
        />

        {hasN1 && (
          <div className="col-span-2">
            <StatCard
              label="Écart vs N−1"
              value={`${ecartN1 > 0 ? "+" : ""}${ecartN1}%`}
              valueClass={Math.abs(ecartN1) > ECART_ALERT ? tauxColor(110, isDark) : (isDark ? "text-slate-300" : "text-slate-700")}
              fillClass={Math.abs(ecartN1) > ECART_ALERT ? "bg-red-500" : "bg-slate-400"}
              barPct={Math.min(100, Math.abs(ecartN1))}
              alert={Math.abs(ecartN1) > ECART_ALERT}
              isDark={isDark}
              animated={animated}
            />
          </div>
        )}
      </div>

      {/* ── Carte de synthèse ────────────────────────────────────────────── */}
      {budgetAlloue > 0 && budgetDemande > 0 && (
        <div className={`rounded-xl border p-4 ${summaryBg}`}>
          <div className="flex items-center justify-between gap-3">

            {/* Alloué */}
            <div className="flex-1 text-center">
              <p className={`text-[9px] font-bold uppercase tracking-[.09em] mb-1.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Alloué
              </p>
              <p className={`text-[13px] font-extrabold font-mono ${blueCls}`}>
                {budgetAlloue.toLocaleString("fr-FR")}
              </p>
              <p className={`text-[9px] font-semibold uppercase ${isDark ? "text-slate-600" : "text-slate-400"}`}>DT</p>
            </div>

            {/* Séparateur vertical */}
            <div className={`self-stretch w-px ${isDark ? "bg-white/[.06]" : "bg-slate-100"}`} />

            {/* Ring */}
            <SummaryRing taux={tauxConsommation} isDark={isDark} animated={animated} />

            {/* Séparateur vertical */}
            <div className={`self-stretch w-px ${isDark ? "bg-white/[.06]" : "bg-slate-100"}`} />

            {/* Demandé */}
            <div className="flex-1 text-center">
              <p className={`text-[9px] font-bold uppercase tracking-[.09em] mb-1.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Demandé
              </p>
              <p className={`text-[13px] font-extrabold font-mono ${amberCls}`}>
                {budgetDemande.toLocaleString("fr-FR")}
              </p>
              <p className={`text-[9px] font-semibold uppercase ${isDark ? "text-slate-600" : "text-slate-400"}`}>DT</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
