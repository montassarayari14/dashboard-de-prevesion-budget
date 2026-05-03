// Carte KPI theme-aware
export default function StatCard({ label, value, sub, valueColor = 'text-primary' }) {
  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl p-4 shadow-sm">
      <p className="text-text-tertiary uppercase text-xs tracking-wide mb-2 font-medium">
        {label}
      </p>
      <p className={`text-2xl font-bold mb-1 ${valueColor}`}>
        {value}
      </p>
      {sub && (
        <p className="text-text-secondary text-xs">
          {sub}
        </p>
      )}
    </div>
  )
}

