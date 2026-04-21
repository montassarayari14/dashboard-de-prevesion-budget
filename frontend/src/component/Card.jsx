export default function Card({ title, value, text, color }) {
  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
      <p className="text-xs uppercase text-slate-500 mb-4">{title}</p>
      <h2 className={`text-4xl font-bold ${color}`}>{value}</h2>
      <p className="text-sm text-slate-500 mt-2">{text}</p>
    </div>
  )
}