// Carte KPI simple : titre, valeur, sous-titre
export default function StatCard({ label, value, sub, valueColor }) {
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e293b",
      borderRadius: "12px",
      padding: "16px"
    }}>
      <p style={{ color: "#64748b", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 0" }}>
        {label}
      </p>
      <p style={{ color: valueColor || "#ffffff", fontSize: "22px", fontWeight: "700", margin: "0 0 4px 0" }}>
        {value}
      </p>
      {sub && (
        <p style={{ color: "#475569", fontSize: "11px", margin: 0 }}>{sub}</p>
      )}
    </div>
  )
}