import { useContext } from "react"
import { useTheme as useContextTheme } from "../ThemeContext"

export function useTheme() {
  const { theme } = useContextTheme()
  const isLight = theme === "light"
  
  const t = {
    // ── Fonds ──────────────────────────────────────────────
    pageBg:    isLight ? "bg-[#F3F4F6]"       : "bg-[#0F172A]",
    cardBg:    isLight ? "bg-[#FFFFFF]"        : "bg-[#1E293B]",
    sidebarBg: isLight ? "bg-[#1E3A8A]"        : "bg-[#020617]",
    headerBg:  isLight ? "bg-[#FFFFFF]"        : "bg-[#1E293B]",
    inputBg:   isLight ? "bg-[#FFFFFF]"        : "bg-[#1e293b]",
    modalBg:   isLight ? "bg-[#FFFFFF]"        : "bg-[#161b27]",
    hoverBg:   isLight ? "hover:bg-[#EFF6FF]"  : "hover:bg-slate-800/50",
    rowHover:  isLight ? "hover:bg-[#EFF6FF]"  : "hover:bg-slate-800/20",
    trackBg:   isLight ? "bg-[#E5E7EB]"        : "bg-slate-800",

    // ── Bordures ────────────────────────────────────────────
    border:   isLight ? "border-[#E5E7EB]"   : "border-slate-800",
    border2:  isLight ? "border-[#D1D5DB]"   : "border-slate-700",
    divide:   isLight ? "divide-[#E5E7EB]"   : "divide-slate-800",

    // ── Textes ──────────────────────────────────────────────
    textMain: isLight ? "text-[#111827]"  : "text-[#F9FAFB]",
    textSub:  isLight ? "text-[#6B7280]"  : "text-[#94A3B8]",
    textMute: isLight ? "text-[#9CA3AF]"  : "text-slate-600",

    // ── Sidebar spécifique ──────────────────────────────────
    sidebarText:       isLight ? "text-[#BFDBFE]"  : "text-[#c7d2fe]",
    sidebarTextMute:   isLight ? "text-[#93C5FD]"  : "text-slate-600",
    sidebarLinkActive: isLight
      ? "text-white bg-[#1D4ED8] border-white"
      : "text-[#a5b4fc] bg-[#1e1b4b] border-[#6366f1]",
    sidebarLinkIdle: isLight
      ? "text-[#BFDBFE] border-transparent hover:text-white"
      : "text-slate-500 border-transparent hover:text-slate-300",
    sidebarDivide: isLight ? "border-[#1D4ED8]" : "border-slate-800",

    // ── Inputs ──────────────────────────────────────────────
    input: isLight
      ? "bg-[#FFFFFF] border-[#D1D5DB] text-[#111827] placeholder-[#9CA3AF] focus:border-[#2563EB]"
      : "bg-[#1e293b] border-slate-700 text-[#F9FAFB] placeholder-slate-500 focus:border-indigo-500",
    inputDis: isLight
      ? "bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
      : "bg-[#1e293b] border-slate-700 text-slate-500 cursor-not-allowed",
    select: isLight
      ? "bg-[#FFFFFF] border-[#D1D5DB] text-[#111827]"
      : "bg-[#1e293b] border-slate-700 text-[#F9FAFB]",

    // ── Tableau ─────────────────────────────────────────────
    thead: isLight
      ? "bg-[#EFF6FF] text-[#6B7280]"
      : "text-slate-500",
    theadBorder: isLight ? "border-[#E5E7EB]" : "border-slate-800",
    tbodyBorder: isLight ? "border-[#F3F4F6]" : "border-slate-800",

    // ── Boutons ─────────────────────────────────────────────
    btnPrimary: isLight
      ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-transparent"
      : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent",
    btnOutline: isLight
      ? "bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border-[#BFDBFE]"
      : "bg-[#1e1b4b] hover:bg-[#1e1b4b]/80 text-[#a5b4fc] border-[#3730a3]",
    btnDanger: isLight
      ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
      : "bg-[#450a0a] text-red-400 border-red-600",
    btnReject: isLight
      ? "bg-[#FEF2F2] text-[#DC2626] border-transparent"
      : "bg-[#7f1d1d] text-[#fca5a5] border-transparent",

    // ── KPI cards ───────────────────────────────────────────
    kpiBlue:   isLight ? "text-[#2563EB]"  : "text-[#818cf8]",
    kpiAmber:  isLight ? "text-[#D97706]"  : "text-[#fbbf24]",
    kpiGreen:  isLight ? "text-[#16A34A]"  : "text-[#4ade80]",
    kpiPurple: isLight ? "text-[#7C3AED]"  : "text-[#c084fc]",
    kpiRed:    isLight ? "text-[#DC2626]"  : "text-[#f87171]",

    // ── Sémantique ──────────────────────────────────────────
    success:     isLight ? "text-[#16A34A]"  : "text-[#22C55E]",
    successBg:   isLight ? "bg-[#F0FDF4]"    : "bg-[#052e16]",
    successBdr:  isLight ? "border-[#BBF7D0]": "border-green-800",
    danger:      isLight ? "text-[#DC2626]"  : "text-[#EF4444]",
    dangerBg:    isLight ? "bg-[#FEF2F2]"    : "bg-[#450a0a]",
    dangerBdr:   isLight ? "border-[#FECACA]": "border-red-600",
    warning:     isLight ? "text-[#D97706]"  : "text-[#FBBF24]",
    warningBg:   isLight ? "bg-[#FFFBEB]"    : "bg-[#1c1300]",
    warningBdr:  isLight ? "border-[#FDE68A]": "border-[#451a03]",

    // ── Pill écart ──────────────────────────────────────────
    pillUp:   isLight ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#052e16] text-[#4ade80]",
    pillDown: isLight ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#450a0a] text-red-400",

    // ── Badges statut ───────────────────────────────────────
    badgeBrouillon: isLight
      ? "bg-[#F1F5F9] text-[#64748B]"
      : "bg-[#1e293b] text-[#94a3b8]",
    badgeAttente: isLight
      ? "bg-[#FFFBEB] text-[#D97706]"
      : "bg-[#451a03] text-[#fbbf24]",
    badgeApprouve: isLight
      ? "bg-[#F0FDF4] text-[#16A34A]"
      : "bg-[#052e16] text-[#4ade80]",
    badgeRejete: isLight
      ? "bg-[#FEF2F2] text-[#DC2626]"
      : "bg-[#450a0a] text-red-400",

    // ── Catégories (tags) ───────────────────────────────────
    catInfo:  isLight ? "bg-[#EFF6FF] text-[#2563EB]"  : "bg-[#1e1b4b] text-[#a5b4fc]",
    catRH:    isLight ? "bg-[#F5F3FF] text-[#7C3AED]"  : "bg-[#2e1065] text-[#c084fc]",
    catInfra: isLight ? "bg-[#FFFBEB] text-[#D97706]"  : "bg-[#1c1300] text-[#fbbf24]",
    catGen:   isLight ? "bg-[#F0FDF4] text-[#16A34A]"  : "bg-[#052e16] text-[#4ade80]",
    catAutre: isLight ? "bg-[#F8FAFC] text-[#64748B]"  : "bg-[#1e293b] text-[#94a3b8]",

    // ── Graphiques (barres) ─────────────────────────────────
    barInfo:  isLight ? "#2563EB" : "#6366f1",
    barRH:    isLight ? "#7C3AED" : "#a855f7",
    barInfra: isLight ? "#D97706" : "#f59e0b",
    barGen:   isLight ? "#16A34A" : "#22c55e",
    barAutre: isLight ? "#64748B" : "#64748b",
    barN1:    isLight ? "#D1D5DB" : "#334155",
    barN:     isLight ? "#2563EB" : "#6366f1",

    // ── Jauge ────────────────────────────────────────────────
    gaugeOk:  isLight ? "bg-[#2563EB]" : "bg-indigo-500",
    gaugeOver: isLight ? "bg-[#DC2626]" : "bg-red-600",

    // ── Overlay modale ───────────────────────────────────────
    overlay: "bg-black/60",
  }

  return { isLight, t, toggleTheme: useContextTheme().toggleTheme }
}
