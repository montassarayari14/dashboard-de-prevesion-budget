// Carte Recommandation IA – Theme-aware
import { useEffect, useState } from "react"
import RiskBadge from "./RiskBadge"

export default function AIRecommendationCard({ analyse }) {
  const [animated, setAnimated] = useState(false)
  
  useEffect(() => {
    setAnimated(true)
  }, [])

  if (!analyse) return null

  const { recommandation, score, risque, justification, facteurs } = analyse

  const isApprove = recommandation === "APPROUVER"

  return (
    <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 ${
      isApprove 
        ? 'bg-success/10 border-success/30' 
        : 'bg-error/10 border-error/30'
    }`}>
      {/* En-tête verdict */}
      <div className="flex items-center justify-between mb-5">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
          isApprove 
            ? "bg-success/20 border border-success/30" 
            : "bg-error/20 border border-error/30"
        }`}>
          <span className={`px-2 py-1 rounded-md text-sm font-semibold ${
            isApprove ? "bg-success/10 text-success" : "bg-error/10 text-error"
          }`}>
            {isApprove ? "Validé" : "Rejeté"}
          </span>
          <span className={`text-xl font-black tracking-wide ${
            isApprove ? "text-success" : "text-error"
          }`}>
            {recommandation}
          </span>
        </div>
        <RiskBadge niveau={risque} />
      </div>

      {/* Métriques */}
      <div className="flex items-center gap-4 mb-5">
        {/* Barre score */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Score IA</span>
            <span className={`text-lg font-bold ${
              score >= 50 ? "text-success" : "text-error"
            }`}>
              {score}/100
            </span>
          </div>
          
          <div className="relative h-3 bg-bg-border/50 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: animated ? `${Math.max(0, Math.min(100, (score + 100) / 2))}%` : '0%'
              }}
              className={`${
                isApprove ? "bg-success" : "bg-error"
              }`}
            />
          </div>
          
          <div className="flex justify-between text-[10px] text-text-tertiary mt-1">
            <span>-100</span>
            <span>0</span>
            <span>+100</span>
          </div>
        </div>
      </div>

      {/* Score circulaire */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full transform -rotate-90 -translate-y-0.5">
            <circle
              cx="56"
              cy="56"
              r="50"
              fill="none"
              stroke="hsl(var(--bg-border))"
              strokeWidth="8"
            />
            <circle
              cx="56"
              cy="56"
              r="50"
              fill="none"
              stroke={isApprove ? "hsl(var(--success))" : "hsl(var(--error))"}
              strokeWidth="8"
              strokeDasharray="314"
              strokeDashoffset={314 - (314 * Math.max(0, Math.min(100, (score + 100) / 2))) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <circle
              cx="56"
              cy="56"
              r="40"
              fill="none"
              stroke={isApprove ? "hsl(var(--success))" : "hsl(var(--error))"}
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.3"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${
              isApprove ? "text-success" : "text-error"
            }`}>
              {score}
            </span>
            <span className="text-xs text-text-tertiary uppercase">Points</span>
          </div>
        </div>
      </div>

      {/* Justification */}
      <div className="bg-bg-card/50 border border-bg-border rounded-xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-lg bg-accent-main/20 flex items-center justify-center text-xs uppercase tracking-[0.25em] font-medium">IA</span>
          <p className="text-accent-main text-xs uppercase tracking-wider font-semibold">Justification IA</p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed pl-8">
          {justification}
        </p>
      </div>

      {/* Facteurs clés */}
      {facteurs && facteurs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-lg bg-accent-main/20 flex items-center justify-center text-xs uppercase tracking-[0.25em] font-medium">Facteurs</span>
            <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold">Facteurs d'analyse</p>
          </div>
          <div className="space-y-2">
            {facteurs.map((f, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${
                  f.impact === "positif" 
                    ? "bg-success/10 border border-success/20" 
                    : f.impact === "negatif" 
                      ? "bg-error/10 border border-error/20"
                      : "bg-bg-card/50 border border-bg-border"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  f.impact === "positif" 
                    ? "bg-success/20" 
                    : f.impact === "negatif" 
                      ? "bg-error/20"
                      : "bg-bg-border/50"
                }`}>
                  <span className={`text-xs uppercase tracking-[0.25em] font-semibold text-center ${
                    f.impact === "positif" ? "text-success" : f.impact === "negatif" ? "text-error" : "text-text-tertiary"
                  }`}>
                    {f.impact === "positif" ? "Positif" : f.impact === "negatif" ? "Négatif" : "Neutre"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-text-primary text-sm">{f.detail}</p>
                  <span className={`text-xs uppercase tracking-wider ${
                    f.impact === "positif" 
                      ? "text-success" 
                      : f.impact === "negatif" 
                        ? "text-error"
                        : "text-text-secondary"
                  }`}>
                    {f.impact === "positif" ? "Impact positif" : f.impact === "negatif" ? "Impact négatif" : "Neutre"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

