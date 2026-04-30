// Carte de recommandation IA avec design moderne et visualisations détaillées
// Affiche le verdict, le score et un résumé visuel

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

  // Design moderne avec glassmorphism
  const cardClass = isApprove 
    ? "bg-gradient-to-br from-green-500/20 via-green-600/10 to-green-500/5 border-green-500/30" 
    : "bg-gradient-to-br from-red-500/20 via-red-600/10 to-red-500/5 border-red-500/30"

  return (
    <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${cardClass}`}>
      {/* En-tête avec verdict */}
      <div className="flex items-center justify-between mb-5">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
          isApprove 
            ? "bg-green-500/20 border border-green-500/30" 
            : "bg-red-500/20 border border-red-500/30"
        }`}>
          <span className="text-2xl">{isApprove ? "✅" : "❌"}</span>
          <span className={`text-xl font-black tracking-wide ${
            isApprove ? "text-green-400" : "text-red-400"
          }`}>
            {recommandation}
          </span>
        </div>
        <RiskBadge niveau={risque} />
      </div>

      {/* Métriques avec design moderne */}
      <div className="flex items-center gap-4 mb-5">
        {/* Jauge de score visuelle */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Score IA</span>
            <span className={`text-lg font-bold ${
              score >= 50 ? "text-green-400" : "text-red-400"
            }`}>
              {score}/100
            </span>
          </div>
          
          {/* Barre de score visuelle avec animation */}
          <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: animated ? `${Math.max(0, Math.min(100, (score + 100) / 2))}%` : '0%',
                background: isApprove
                  ? "linear-gradient(90deg, #16a34a, #4ade80)"
                  : "linear-gradient(90deg, #dc2626, #f87171)"
              }}
            />
            {/* Marqueurs visuels */}
            <div className="absolute inset-0 flex justify-between px-1">
              <div className="w-0.5 h-full bg-slate-700/50"></div>
              <div className="w-0.5 h-full bg-slate-700/50"></div>
              <div className="w-0.5 h-full bg-slate-700/50"></div>
              <div className="w-0.5 h-full bg-slate-700/50"></div>
              <div className="w-0.5 h-full bg-slate-700/50"></div>
            </div>
          </div>
          
          {/* Échelle */}
          <div className="flex justify-between text-[10px] text-slate-600 mt-1">
            <span>-100</span>
            <span>0</span>
            <span>+100</span>
          </div>
        </div>
      </div>

      {/* Indicateur circulaire de score */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full transform -rotate-90">
            {/* Cercle de fond */}
            <circle
              cx="56"
              cy="56"
              r="50"
              fill="none"
              stroke={isApprove ? "#16a34a20" : "#dc262620"}
              strokeWidth="8"
            />
            {/* Cercle de progression */}
            <circle
              cx="56"
              cy="56"
              r="50"
              fill="none"
              stroke={isApprove ? "#4ade80" : "#f87171"}
              strokeWidth="8"
              strokeDasharray={314}
              strokeDashoffset={314 - (314 * Math.max(0, Math.min(100, (score + 100) / 2))) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* Cercles décoratifs */}
            <circle
              cx="56"
              cy="56"
              r="40"
              fill="none"
              stroke={isApprove ? "#16a34a10" : "#dc262610"}
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          {/* Centre de l'indicateur */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${
              isApprove ? "text-green-400" : "text-red-400"
            }`}>
              {score}
            </span>
            <span className="text-xs text-slate-500 uppercase">Points</span>
          </div>
        </div>
      </div>

      {/* Justification avec design détaillé */}
      <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs">🤖</span>
          <p className="text-indigo-400 text-xs uppercase tracking-wider font-semibold">Justification IA</p>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed pl-8">
          {justification}
        </p>
      </div>

      {/* Facteurs clés avec design moderne */}
      {facteurs && facteurs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs">📊</span>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Facteurs d'analyse</p>
          </div>
          <div className="space-y-2">
            {facteurs.map((f, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.01] ${
                  f.impact === "positif" 
                    ? "bg-green-500/10 border border-green-500/20" 
                    : f.impact === "negatif" 
                      ? "bg-red-500/10 border border-red-500/20"
                      : "bg-slate-800/30 border border-white/5"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  f.impact === "positif" 
                    ? "bg-green-500/20" 
                    : f.impact === "negatif" 
                      ? "bg-red-500/20"
                      : "bg-slate-700/30"
                }`}>
                  <span className="text-sm">
                    {f.impact === "positif" ? "✅" : f.impact === "negatif" ? "❌" : "⚠️"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{f.detail}</p>
                  <span className={`text-xs uppercase tracking-wider ${
                    f.impact === "positif" 
                      ? "text-green-400" 
                      : f.impact === "negatif" 
                        ? "text-red-400"
                        : "text-slate-500"
                  }`}>
                    {f.impact === "positif" ? "Impact positif" : f.impact === "negatif" ? "Impact négatif" : "Neutre"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style d'animation */}
      <style>{`
        @keyframes scoreGlow {
          0%, 100% { filter: blur(0); }
          50% { filter: blur(4px); }
        }
      `}</style>
    </div>
  )
}
