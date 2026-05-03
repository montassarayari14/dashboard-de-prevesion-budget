import { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts"
import DirecteurSidebar from "../../component/directeur/DirecteurSidebar"
import EcartPill from "../../component/directeur/EcartPill"
import { useTheme } from "../../hooks/useTheme"
import API from "../../api/axios"

// ── Tooltip personnalisé pour les barres ────────────────────────────────────
function CustomTooltip({ active, payload, label, t }) {
  if (!active || !payload?.length) return null
  return (
    <div className={`${t.cardBg} border ${t.border} rounded-lg px-3 py-2 shadow-lg text-[12px]`}>
      <p className={`${t.textMain} font-semibold mb-1`}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name} : {Number(p.value).toLocaleString("fr-FR")} DT
        </p>
      ))}
    </div>
  )
}

// ── Tooltip donut ────────────────────────────────────────────────────────────
function DonutTooltip({ active, payload, t }) {
  if (!active || !payload?.length) return null
  return (
    <div className={`${t.cardBg} border ${t.border} rounded-lg px-3 py-2 shadow-lg text-[12px]`}>
      <p style={{ color: payload[0].payload.color }} className="font-semibold">
        {payload[0].name}
      </p>
      <p className={t.textSub}>{Number(payload[0].value).toLocaleString("fr-FR")} DT</p>
    </div>
  )
}

export default function DirecteurStatistiques() {
  const [direction, setDirection] = useState(null)
  const { isLight, t }            = useTheme()

  useEffect(() => {
    API.get("/directions/ma-direction").then((res) => setDirection(res.data))
  }, [])

  if (!direction) return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <DirecteurSidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className={t.textSub}>Chargement...</p>
      </div>
    </div>
  )

  // ── Calculs — inchangés ────────────────────────────────────────────────────
  const postes    = direction.postes || []
  const totalN    = postes.reduce((s, p) => s + (p.montant   || 0), 0)
  const totalN1   = postes.reduce((s, p) => s + (p.montantN1 || 0), 0)
  const pctGlobal = totalN1 > 0 ? Math.round(((totalN - totalN1) / totalN1) * 100) : 0
  const budget    = direction.budget || 0
  const pctUtil   = budget > 0 ? Math.round((totalN / budget) * 100) : 0

  const parCat = {}
  postes.forEach((p) => {
    parCat[p.categorie] = (parCat[p.categorie] || 0) + (p.montant || 0)
  })

  const postesAvecEcart = postes
    .filter((p) => p.montantN1 > 0)
    .map((p) => ({ ...p, pct: Math.round(((p.montant - p.montantN1) / p.montantN1) * 100) }))
    .sort((a, b) => b.pct - a.pct)

  const plusHausse = postesAvecEcart[0]
  const plusBaisse = postesAvecEcart[postesAvecEcart.length - 1]

  const catColors = {
    "Informatique":   isLight ? "#2563EB" : "#6366f1",
    "RH / Formation": isLight ? "#7C3AED" : "#a855f7",
    "Infrastructure": isLight ? "#D97706" : "#f59e0b",
    "Général":        isLight ? "#16A34A" : "#22c55e",
    "Autre":          isLight ? "#64748B" : "#64748b",
  }

  // ── Données pour le graphique barres groupées ──────────────────────────────
  const barData = postes.map((p) => ({
    name: p.categorie === "RH / Formation" ? "RH" : p.categorie.substring(0, 6).toUpperCase(),
    "2024": p.montantN1 || 0,
    "2025": p.montant   || 0,
    color: catColors[p.categorie] || "#64748b",
  }))

  // ── Données pour le donut ──────────────────────────────────────────────────
  const donutData = Object.entries(parCat).map(([cat, montant]) => ({
    name:   cat,
    value:  montant,
    color:  catColors[cat] || "#64748b",
  }))

  // ── Couleurs axes selon thème ──────────────────────────────────────────────
  const axisColor = isLight ? "#9CA3AF" : "#475569"
  const gridColor = isLight ? "#F3F4F6" : "#1e293b"

  // ── KPIs (sans "Budget alloué") ───────────────────────────────────────────
  const kpis = [
    { label: "Total estimé 2025", value: `${totalN.toLocaleString("fr-FR")} DT`,  color: isLight ? "text-[#D97706]" : "text-[#fbbf24]" },
    { label: "Total 2024",        value: `${totalN1.toLocaleString("fr-FR")} DT`, color: t.textSub },
    { label: "Variation globale",
      value: `${pctGlobal > 0 ? "+" : ""}${pctGlobal}%`,
      color: pctGlobal > 0
        ? (isLight ? "text-[#16A34A]" : "text-[#4ade80]")
        : "text-red-500" },
  ]

  return (
    <div className={`min-h-screen ${t.pageBg} flex`}>
      <DirecteurSidebar />

      <div className="flex-1 p-8">

        {/* ── En-tête ── */}
        <div className="mb-8">
          <h1 className={`text-[26px] font-bold mb-2 ${t.textMain}`}>Statistiques</h1>
          <p className={`${t.textSub} text-[14px]`}>
            Comparaison N vs N-1 · Direction {direction.nom}
          </p>
        </div>

        {/* ── KPIs (3 colonnes, sans budget alloué) ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {kpis.map((k) => (
            <div key={k.label} className={`${t.cardBg} border ${t.border} rounded-xl p-5`}>
              <p className={`${t.textSub} text-[11px] uppercase tracking-wide mb-3`}>{k.label}</p>
              <p className={`${k.color} text-[22px] font-bold leading-none`}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* ── Graphiques ── */}
        <div className="grid grid-cols-2 gap-5 mb-5">

          {/* Barres groupées 2024 vs 2025 */}
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
            <h2 className={`${t.textMain} text-[15px] font-semibold mb-1`}>
              Comparaison poste par poste
            </h2>
            <p className={`${t.textSub} text-[12px] mb-5`}>2024 vs 2025</p>

            {postes.length === 0 ? (
              <p className={`${t.textSub} text-[13px]`}>Aucun poste saisi.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barCategoryGap="30%" barGap={4}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: axisColor, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: axisColor, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    width={32}
                  />
                  <Tooltip content={<CustomTooltip t={t} />} cursor={{ fill: "transparent" }} />
                  <Legend
                    iconType="square"
                    iconSize={10}
                    wrapperStyle={{ fontSize: 12, color: axisColor, paddingTop: 8 }}
                  />
                  <Bar dataKey="2024" fill={isLight ? "#D1D5DB" : "#334155"} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="2025" radius={[3, 3, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Donut */}
          <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
            <h2 className={`${t.textMain} text-[15px] font-semibold mb-1`}>
              Répartition par catégorie
            </h2>
            <p className={`${t.textSub} text-[12px] mb-4`}>Part du budget estimé</p>

            {donutData.length === 0 ? (
              <p className={`${t.textSub} text-[13px]`}>Aucune donnée.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DonutTooltip t={t} />} />
                  <Legend
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: 12, color: axisColor }}
                    formatter={(value) => (
                      <span style={{ color: catColors[value] || axisColor }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Résumé des variations (inchangé) ── */}
        <div className={`${t.cardBg} border ${t.border} rounded-xl p-6`}>
          <h2 className={`${t.textMain} text-[15px] font-semibold mb-4`}>Résumé des variations</h2>
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[13px]">

            <div className="flex justify-between items-center">
              <span className={t.textSub}>Taux d'utilisation</span>
              <span className={`font-semibold ${pctUtil > 100 ? "text-red-500" : (isLight ? "text-[#16A34A]" : "text-[#4ade80]")}`}>
                {pctUtil}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className={t.textSub}>Variation nette</span>
              <span className={`font-semibold font-mono ${pctGlobal >= 0 ? (isLight ? "text-[#16A34A]" : "text-[#4ade80]") : "text-red-500"}`}>
                {pctGlobal > 0 ? "+" : ""}{(totalN - totalN1).toLocaleString("fr-FR")} DT ({pctGlobal > 0 ? "+" : ""}{pctGlobal}%)
              </span>
            </div>

            {plusHausse && (
              <div className="flex justify-between items-center">
                <span className={t.textSub}>Plus forte hausse</span>
                <span className={`${t.textMain} font-medium`}>
                  {plusHausse.nom}{" "}
                  <span className={isLight ? "text-[#16A34A]" : "text-[#4ade80]"}>+{plusHausse.pct}%</span>
                </span>
              </div>
            )}

            {plusBaisse && plusBaisse.pct < 0 && (
              <div className="flex justify-between items-center">
                <span className={t.textSub}>Plus forte baisse</span>
                <span className={`${t.textMain} font-medium`}>
                  {plusBaisse.nom}{" "}
                  <span className="text-red-500">{plusBaisse.pct}%</span>
                </span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}