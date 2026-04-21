import { Navigate } from "react-router-dom"

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token")
  const user  = JSON.parse(localStorage.getItem("user") || "{}")

  // Pas de token → login
  if (!token) return <Navigate to="/login" replace />

  // ✅ Rôles autorisés dans l'application
  const rolesAutorises = ["Admin", "DG", "Directeur", "Directeur Generale"]
  if (!rolesAutorises.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}