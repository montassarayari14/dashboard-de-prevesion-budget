export default function Card({ title, value, text, color }) {
  return (
    <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-5 shadow-sm">
      <p className="text-xs uppercase text-[#6B7280] mb-4">{title}</p>
      <h2 className={`text-4xl font-bold ${color}`}>{value}</h2>
      <p className="text-sm text-[#6B7280] mt-2">{text}</p>
    </div>
  )
}
