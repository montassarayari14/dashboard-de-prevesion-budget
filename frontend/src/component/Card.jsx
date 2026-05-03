import { useTheme } from "../hooks/useTheme"

export default function Card({ title, value, text, color }) {
  const { isLight } = useTheme()

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
      isLight
        ? "bg-white border-[#e2e7f0] shadow-sm hover:shadow-md"
        : "bg-[#0f172a] border-slate-800 hover:border-slate-700"
    }`}>
      {/* Cercle décoratif fond */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 ${color.replace("text-", "bg-")}`} />

      <p className={`text-xs uppercase tracking-widest font-semibold mb-4 ${
        isLight ? "text-[#94a3b8]" : "text-slate-500"
      }`}>{title}</p>

      <h2 className={`text-4xl font-bold ${color}`}>{value}</h2>

      <p className={`text-sm mt-2 ${isLight ? "text-[#64748b]" : "text-slate-500"}`}>{text}</p>

      {/* Ligne accent en bas */}
      <div className={`absolute bottom-0 left-0 h-0.5 w-1/3 opacity-60 ${color.replace("text-", "bg-")}`} />
    </div>
  )
}