export default function RoleItem({ title, number, percent, width, color }) {
  return (
    <div className="mb-5">

      <div className="flex justify-between text-sm mb-2">
        <span>{title}</span>
        <span>{number} ({percent})</span>
      </div>

      <div className="w-full h-2 bg-slate-800 rounded-full">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width }}
        ></div>
      </div>

    </div>
  )
}