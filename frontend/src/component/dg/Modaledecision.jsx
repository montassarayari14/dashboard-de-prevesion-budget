import { useState } from "react"

// Modale de décision du DG : approuver ou rejeter une demande
export default function ModaleDecision({ direction, onClose, onConfirm }) {
  const [choix, setChoix] = useState("approuver")
  const [commentaire, setCommentaire] = useState("")

  if (!direction) return null

  function handleConfirm() {
    onConfirm(direction, choix, commentaire)
    onClose()
  }

  return (
    // Fond sombre derrière la modale
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000
      }}
    >
      {/* Boîte de la modale */}
      <div style={{
        background: "#161b27",
        border: "1px solid #1e293b",
        borderRadius: "16px",
        padding: "24px",
        width: "380px",
        color: "#ffffff"
      }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>Décision sur la demande</h3>
        <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 20px 0" }}>
          Direction {direction.code} · {direction.totalDemande?.toLocaleString("fr-FR")} DT demandés
        </p>

        {/* Choix : Approuver ou Rejeter */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setChoix("approuver")}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: choix === "approuver" ? "1px solid #16a34a" : "1px solid #1e293b",
              background: choix === "approuver" ? "#052e16" : "transparent",
              color: choix === "approuver" ? "#4ade80" : "#475569",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600"
            }}
          >
            Approuver
          </button>
          <button
            onClick={() => setChoix("rejeter")}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: choix === "rejeter" ? "1px solid #dc2626" : "1px solid #1e293b",
              background: choix === "rejeter" ? "#450a0a" : "transparent",
              color: choix === "rejeter" ? "#f87171" : "#475569",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600"
            }}
          >
            Rejeter
          </button>
        </div>

        {/* Commentaire optionnel */}
        <label style={{ display: "block", color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>
          Commentaire (optionnel)
        </label>
        <textarea
          rows={3}
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Ex : Budget validé, bonne justification..."
          style={{
            width: "100%", boxSizing: "border-box",
            background: "#0f172a", border: "1px solid #1e293b",
            borderRadius: "10px", padding: "10px 12px",
            color: "#ffffff", fontSize: "13px",
            outline: "none", resize: "none", marginBottom: "20px"
          }}
        />

        {/* Boutons Annuler / Confirmer */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px", borderRadius: "10px",
              border: "1px solid #1e293b", background: "transparent",
              color: "#94a3b8", cursor: "pointer", fontSize: "13px"
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1, padding: "10px", borderRadius: "10px",
              border: "none",
              background: choix === "approuver" ? "#16a34a" : "#dc2626",
              color: "#ffffff", cursor: "pointer",
              fontSize: "13px", fontWeight: "600"
            }}
          >
            {choix === "approuver" ? "Confirmer" : "Confirmer le rejet"}
          </button>
        </div>
      </div>
    </div>
  )
}