import { useTheme } from "../hooks/useTheme"

export default function RoleItem({ title, number, percent, width, color }) {
  const { isLight } = useTheme()

  return (
    <div className="mb-5">

      <div className={`flex justify-between text-sm mb-2 ${isLight ? "text-[#1a202c]" : "text-slate-300"}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
          <span>{title}</span>
        </div>
        <span className={`font-mono text-xs ${isLight ? "text-[#64748b]" : "text-slate-400"}`}>
          {number} ({percent})
        </span>
      </div>

      <div className={`w-full h-2 rounded-full ${isLight ? "bg-[#e8ecf4]" : "bg-slate-800"}`}>
        <div
          className={`h-2 rounded-full transition-all duration-700 ${color}`}
          style={{ width }}
        />
      </div>

    </div>
  )
}