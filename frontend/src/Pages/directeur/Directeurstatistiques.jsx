import { useState, useEffect } from "react"
import DirecteurSidebar from "../../component/directeur/DirecteurSidebar"
import EcartPill from "../../component/directeur/EcartPill"
import API from "../../api/axios"

const catColors = {
  "Informatique":   "#6366f1",
  "RH / Formation": "#a855f7",
  "Infrastructure": "#f59e0b",
  "Général":        "#22c55e",
  "Autre":          "#64748b",
}

export default function DirecteurStatistiques() {
  const [direction, setDirection] = useState(null)

  useEffect(() => {
    API.get("/directions/ma-direction").then((res) => setDirection(res.data))
  }, [])

  if (!direction) return (
    <div style={{ minHeight: "100vh", background: "#050b1a", display: "flex" }}>
      <DirecteurSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#475569" }}>Chargement...</p>
      </div>
    </div>
  )

  const postes       = direction.postes || []
  const totalN       = postes.reduce((s, p) => s + (p.montant || 0), 0)
  const totalN1      = postes.reduce((s, p) => s + (p.montantN1 || 0), 0)
  const pctGlobal    = totalN1 > 0 ? Math.round(((totalN - totalN1) / totalN1) * 100) : 0
  const budget       = direction.budget || 0
  const pctUtil      = budget > 0 ? Math.round((totalN / budget) * 100) : 0

  // Répartition catégorie
  const parCat = {}
  postes.forEach((p) => {
    parCat[p.categorie] = (parCat[p.categorie] || 0) + (p.montant || 0)
  })

  // Plus forte hausse et baisse
  const postesAvecEcart = postes
    .filter((p) => p.montantN1 > 0)
    .map((p) => ({ ...p, ecart: p.montant - p.montantN1, pct: Math.round(((p.montant - p.montantN1) / p.montantN1) * 100) }))
    .sort((a, b) => b.pct - a.pct)

  const plusHausse = postesAvecEcart[0]
  const plusBaisse = postesAvecEcart[postesAvecEcart.length - 1]

  return (
    <div style={{ minHeight: "100vh", background: "#050b1a", color: "#fff", display: "flex" }}>
      <DirecteurSidebar />

      <div style={{ flex: 1, padding: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0" }}>Statistiques</h1>
        <p style={{ color: "#64748b", margin: "0 0 24px 0" }}>Comparaison N vs N-1 · Direction {direction.nom}</p>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Budget alloué",    value: `${budget.toLocaleString("fr-FR")} DT`,     color: "#818cf8" },
            { label: "Total estimé 2025", value: `${totalN.toLocaleString("fr-FR")} DT`,    color: "#fbbf24" },
            { label: "Total 2024",        value: `${totalN1.toLocaleString("fr-FR")} DT`,   color: "#64748b" },
            { label: "Variation globale", value: `${pctGlobal > 0 ? "+" : ""}${pctGlobal}%`, color: pctGlobal > 0 ? "#4ade80" : "#f87171" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px" }}>
              <p style={{ color: "#64748b", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 0" }}>{k.label}</p>
              <p style={{ color: k.color, fontSize: "20px", fontWeight: "700", margin: 0 }}>{k.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* Comparaison poste par poste */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 20px 0" }}>Comparaison poste par poste</h2>

            {postes.length === 0 ? (
              <p style={{ color: "#475569", fontSize: "13px" }}>Aucun poste saisi</p>
            ) : (
              postes.map((p, i) => {
                const pct = p.montantN1 > 0 ? Math.round(((p.montant - p.montantN1) / p.montantN1) * 100) : 0
                return (
                  <div key={i} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ color: "#94a3b8", fontSize: "12px" }}>{p.nom}</span>
                      <EcartPill montant={p.montant} montantN1={p.montantN1} />
                    </div>
                    {/* Barre N-1 */}
                    <div style={{ marginBottom: "3px" }}>
                      <p style={{ color: "#475569", fontSize: "10px", margin: "0 0 2px 0" }}>
                        2024 — {p.montantN1 ? `${p.montantN1.toLocaleString("fr-FR")} DT` : "—"}
                      </p>
                      <div style={{ background: "#1e293b", borderRadius: "3px", height: "5px" }}>
                        <div style={{ width: `${p.montantN1 && totalN1 ? Math.round((p.montantN1 / totalN1) * 100) : 0}%`, height: "5px", borderRadius: "3px", background: "#334155" }} />
                      </div>
                    </div>
                    {/* Barre N */}
                    <div>
                      <p style={{ color: "#818cf8", fontSize: "10px", margin: "0 0 2px 0" }}>
                        2025 — {p.montant.toLocaleString("fr-FR")} DT
                      </p>
                      <div style={{ background: "#1e293b", borderRadius: "3px", height: "5px" }}>
                        <div style={{ width: `${totalN > 0 ? Math.round((p.montant / totalN) * 100) : 0}%`, height: "5px", borderRadius: "3px", background: catColors[p.categorie] || "#6366f1" }} />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Colonne droite */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Répartition par catégorie */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 16px 0" }}>Répartition par catégorie</h2>
              {Object.entries(parCat).map(([cat, montant]) => {
                const pct = totalN > 0 ? Math.round((montant / totalN) * 100) : 0
                return (
                  <div key={cat} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ color: "#94a3b8" }}>{cat}</span>
                      <span style={{ color: catColors[cat] || "#64748b", fontFamily: "monospace" }}>{pct}%</span>
                    </div>
                    <div style={{ background: "#1e293b", borderRadius: "3px", height: "5px" }}>
                      <div style={{ width: `${pct}%`, height: "5px", borderRadius: "3px", background: catColors[cat] || "#6366f1" }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Résumé des variations */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 14px 0" }}>Résumé des variations</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Taux d'utilisation</span>
                  <span style={{ color: pctUtil > 100 ? "#f87171" : "#4ade80", fontWeight: "600" }}>{pctUtil}%</span>
                </div>
                {plusHausse && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Plus forte hausse</span>
                    <span style={{ color: "#e2e8f0" }}>{plusHausse.nom} +{plusHausse.pct}%</span>
                  </div>
                )}
                {plusBaisse && plusBaisse.pct < 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Plus forte baisse</span>
                    <span style={{ color: "#e2e8f0" }}>{plusBaisse.nom} {plusBaisse.pct}%</span>
                  </div>
                )}
                <div style={{ borderTop: "1px solid #1e293b", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Variation nette</span>
                  <span style={{ color: pctGlobal >= 0 ? "#4ade80" : "#f87171", fontWeight: "600" }}>
                    {pctGlobal > 0 ? "+" : ""}{(totalN - totalN1).toLocaleString("fr-FR")} DT ({pctGlobal > 0 ? "+" : ""}{pctGlobal}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}