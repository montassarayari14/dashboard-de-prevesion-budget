import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DirecteurSidebar from "../../component/directeur/DirecteurSidebar"
import StatutBadge from "../../component/directeur/StatutBadge"
import { useTheme } from "../../hooks/useTheme"
import API from "../../api/axios"

// ── Jauge circulaire simple ─────────────────────────────────────────────────
function CircleGauge({ pct, isLight }) {
  const r      = 34
  const cx     = 42
  const cy     = 42
  const circ   = 2 * Math.PI * r
  const offset = circ - (Math.min(pct, 100) / 100) * circ
  const over   = pct > 100
  const color  = over ? "#EF4444" : (isLight ? "#2563EB" : "#6366f1")

  return (
    <svg width="84" height="84" viewBox="0 0 84 84">
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={isLight ? "#E5E7EB" : "#1e293b"} strokeWidth="8" />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy + 5} textAnchor="middle"
        fontSize="14" fontWeight="700" fill={color}>
        {pct}%
      </text>
    </svg>
  )
}

export default function DirecteurDashboard() {
  const [direction, setDirection] = useState(null)
  const [loading, setLoading]     = useState(true)
  const { isLight, t }            = useTheme()
  const navigate                  = useNavigate()

  useEffect(() => {
    API.get("/directions/ma-direction")
      .then((res) => setDirection(res.data))
      .finally(() => setLoading(false))
  }, [])

  async function handleSoumettre() {
    if (!direction || direction.statut !== "brouillon") return
    if (!window.confirm("Confirmer la soumission à la Direction Générale ?")) return
    try {
      const res = await API.put(`/directions/${direction._id}/soumettre`, { postes: direction.postes })
      setDirection(res.data)
    } catch {
      alert("Erreur lors de la soumission")
    }
  }

  if (loading) return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <DirecteurSidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className={t.textSub}>Chargement...</p>
      </div>
    </div>
  )

  if (!direction) return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <DirecteurSidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className={t.danger}>Aucune direction assignée. Contactez l'administrateur.</p>
      </div>
    </div>
  )

  // ── Calculs — inchangés ────────────────────────────────────────────────────
  const totalEstime = direction.postes?.reduce((s, p) => s + (p.montant || 0), 0) || 0
  const totalN1     = direction.postes?.reduce((s, p) => s + (p.montantN1 || 0), 0) || 0
  const reste       = (direction.budget || 0) - totalEstime
  const pctUtil     = direction.budget ? Math.round((totalEstime / direction.budget) * 100) : 0
  const pctVsN1     = totalN1 > 0 ? Math.round(((totalEstime - totalN1) / totalN1) * 100) : 0

  const parCategorie = {}
  direction.postes?.forEach((p) => {
    parCategorie[p.categorie] = (parCategorie[p.categorie] || 0) + (p.montant || 0)
  })

  const catColors = {
    "Informatique":   isLight ? "#2563EB" : "#6366f1",
    "RH / Formation": isLight ? "#7C3AED" : "#a855f7",
    "Infrastructure": isLight ? "#D97706" : "#f59e0b",
    "Général":        isLight ? "#16A34A" : "#22c55e",
    "Autre":          isLight ? "#64748B" : "#64748b",
  }

  const kpis = [
    { label: "Budget alloué",    value: `${(direction.budget || 0).toLocaleString("fr-FR")} DT`, color: isLight ? "text-[#2563EB]" : "text-[#818cf8]" },
    { label: "Total estimé",     value: `${totalEstime.toLocaleString("fr-FR")} DT`,             color: isLight ? "text-[#D97706]" : "text-[#fbbf24]" },
    { label: "Reste disponible", value: `${reste.toLocaleString("fr-FR")} DT`,                   color: reste >= 0 ? (isLight ? "text-[#16A34A]" : "text-[#4ade80]") : "text-red-500" },
    { label: "vs 2024",          value: `${pctVsN1 > 0 ? "+" : ""}${pctVsN1}%`,                 color: isLight ? "text-[#7C3AED]" : "text-[#c084fc]" },
  ]

  return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <DirecteurSidebar />

      <div className="flex-1 p-8">

        {/* ── En-tête ── */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-[26px] font-bold mb-2 ${t.textMain}`}>Tableau de bord</h1>
            <p className={`${t.textSub} text-[14px]`}>
              Direction {direction.nom} · Campagne 2025
            </p>
          </div>
          <StatutBadge statut={direction.statut || "brouillon"} />
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((k) => (
            <div key={k.label} className={`${t.cardBg} border ${t.border} rounded-xl p-5`}>
              <p className={`${t.textSub} text-[11px] uppercase tracking-wide mb-3`}>{k.label}</p>
              <p className={`${k.color} text-[22px] font-bold leading-none`}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* ── Grille principale ── */}
        <div className="grid grid-cols-[3fr_2fr] gap-5">

          {/* Répartition par catégorie */}
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
            <h2 className={`${t.textMain} text-[15px] font-semibold mb-5`}>Répartition par catégorie</h2>

            {Object.keys(parCategorie).length === 0 ? (
              <p className={`${t.textSub} text-[13px]`}>Aucun poste saisi.</p>
            ) : (
              Object.entries(parCategorie).map(([cat, montant]) => {
                const pct   = totalEstime > 0 ? Math.round((montant / totalEstime) * 100) : 0
                const color = catColors[cat] || "#64748b"
                return (
                  <div key={cat} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`${t.textSub} text-[13px]`}>{cat}</span>
                      <span className="font-mono text-[13px] font-medium" style={{ color }}>
                        {montant.toLocaleString("fr-FR")} DT · {pct}%
                      </span>
                    </div>
                    <div className={`${t.trackBg} rounded-full h-[6px]`}>
                      <div
                        className="h-[6px] rounded-full"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                )
              })
            )}

            <div className={`border-t ${t.border} mt-5 pt-4 flex justify-between items-center`}>
              <span className={`${t.textSub} text-[13px]`}>
                {direction.postes?.length || 0} postes de dépenses
              </span>
              <span className={`text-[13px] font-semibold ${isLight ? "text-[#D97706]" : "text-[#fbbf24]"}`}>
                {totalEstime.toLocaleString("fr-FR")} / {(direction.budget || 0).toLocaleString("fr-FR")} DT
              </span>
            </div>
          </div>

          {/* Droite */}
          <div className="flex flex-col gap-5">

            {/* Jauge circulaire */}
            <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
              <h2 className={`${t.textMain} text-[15px] font-semibold mb-4`}>Utilisation de l'enveloppe</h2>

              <div className="flex items-center gap-5">
                <CircleGauge pct={pctUtil} isLight={isLight} />
                <div className="flex flex-col gap-2 text-[13px]">
                  <div>
                    <p className={`${t.textSub} text-[11px] mb-[2px]`}>Estimé</p>
                    <p className={`${isLight ? "text-[#D97706]" : "text-[#fbbf24]"} font-mono font-semibold`}>
                      {totalEstime.toLocaleString("fr-FR")} DT
                    </p>
                  </div>
                  <div>
                    <p className={`${t.textSub} text-[11px] mb-[2px]`}>Alloué</p>
                    <p className={`${isLight ? "text-[#2563EB]" : "text-[#818cf8]"} font-mono font-semibold`}>
                      {(direction.budget || 0).toLocaleString("fr-FR")} DT
                    </p>
                  </div>
                </div>
              </div>

              {pctUtil > 100 && (
                <p className={`${t.danger} text-[12px] mt-3 font-medium`}>
                  ⚠ Dépassement de l'enveloppe
                </p>
              )}
            </div>

            {/* Statut */}
            <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
              <h2 className={`${t.textMain} text-[15px] font-semibold mb-4`}>Statut de la demande</h2>

              <div className="flex flex-col gap-3 text-[13px]">
                <div className="flex justify-between items-center">
                  <span className={t.textSub}>Statut actuel</span>
                  <StatutBadge statut={direction.statut || "brouillon"} />
                </div>
                <div className="flex justify-between items-center">
                  <span className={t.textSub}>Soumis à la DG</span>
                  <span className={`font-mono text-[12px] ${direction.soumisLe ? (isLight ? "text-[#16A34A]" : "text-[#4ade80]") : t.textMute}`}>
                    {direction.soumisLe
                      ? new Date(direction.soumisLe).toLocaleDateString("fr-FR")
                      : "Non encore"}
                  </span>
                </div>
                {direction.commentaireDG && (
                  <div className={`${t.warningBg} border ${t.warningBdr} rounded-lg px-3 py-[10px] mt-1`}>
                    <p className={`${t.warning} text-[11px] font-semibold mb-1`}>Commentaire DG</p>
                    <p className={`${t.warning} text-[12px] opacity-90`}>{direction.commentaireDG}</p>
                  </div>
                )}
              </div>

              {direction.statut === "brouillon" && (
                <button
                  onClick={handleSoumettre}
                  disabled={!direction?.postes?.length}
                  className={`w-full mt-5 py-[11px] border rounded-[10px] text-[13px] font-semibold cursor-pointer disabled:opacity-40 ${t.btnPrimary}`}
                >
                  Soumettre à la DG
                </button>
              )}
              {direction.statut === "rejete" && (
                <button
                  onClick={() => navigate("/direction/budget")}
                  className={`w-full mt-5 py-[11px] border rounded-[10px] text-[13px] font-semibold cursor-pointer ${t.btnReject}`}
                >
                  Réviser et resoumettre
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}