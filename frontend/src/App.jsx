import { Routes, Route, Navigate } from "react-router-dom"

// ── Commun ──
import LoginPage    from "./Pages/LoginPage.jsx"
import PrivateRoute from "./component/PrivateRoute"

// ── Axe 1 : Admin ──
import Dashboard     from "./Pages/Dashboard"
import AccountPage   from "./Pages/Account"
import AuditPage     from "./Pages/Audit"
import ParametresPage from "./Pages/Parametres"   // ← nouveau

// ── Axe 2 : Directeur de direction ──
import DirecteurDashboard    from "./Pages/directeur/DirecteurDashboard"
import DirecteurBudget       from "./Pages/directeur/DirecteurBudget"
import DirecteurStatistiques from "./Pages/directeur/DirecteurStatistiques"
import DirecteurHistorique   from "./Pages/directeur/DirecteurHistorique"

// ── Axe 3 : Directeur Général ──
import DGDashboard    from "./Pages/dg/DGDashboard"
import DGDemandes     from "./Pages/dg/DGDemandes"
import DGDetail       from "./Pages/dg/DGDetail"
import DGStatistiques from "./Pages/dg/DGStatistiques"
import DGHistorique   from "./Pages/dg/DGHistorique"

export default function App() {
  return (
    <Routes>

      {/* Connexion unique — redirige selon le rôle */}
      <Route path="/login" element={<LoginPage />} />

      {/* ── Axe 1 : Admin ── */}
      <Route path="/dashboard"         element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/admin/comptes"     element={<PrivateRoute><AccountPage /></PrivateRoute>} />
      <Route path="/admin/logs"        element={<PrivateRoute><AuditPage /></PrivateRoute>} />
      <Route path="/admin/parametres"  element={<PrivateRoute><ParametresPage /></PrivateRoute>} />

      {/* ── Axe 2 : Directeur de direction ── */}
      <Route path="/direction/dashboard"    element={<PrivateRoute><DirecteurDashboard /></PrivateRoute>} />
      <Route path="/direction/budget"       element={<PrivateRoute><DirecteurBudget /></PrivateRoute>} />
      <Route path="/direction/statistiques" element={<PrivateRoute><DirecteurStatistiques /></PrivateRoute>} />
      <Route path="/direction/historique"   element={<PrivateRoute><DirecteurHistorique /></PrivateRoute>} />

      {/* ── Axe 3 : Directeur Général ── */}
      <Route path="/dg/dashboard"    element={<PrivateRoute><DGDashboard /></PrivateRoute>} />
      <Route path="/dg/demandes"     element={<PrivateRoute><DGDemandes /></PrivateRoute>} />
      <Route path="/dg/demandes/:id" element={<PrivateRoute><DGDetail /></PrivateRoute>} />
      <Route path="/dg/en-attente"   element={<PrivateRoute><DGDemandes /></PrivateRoute>} />
      <Route path="/dg/approuvees"   element={<PrivateRoute><DGDemandes /></PrivateRoute>} />
      <Route path="/dg/rejetees"     element={<PrivateRoute><DGDemandes /></PrivateRoute>} />
      <Route path="/dg/statistiques" element={<PrivateRoute><DGStatistiques /></PrivateRoute>} />
      <Route path="/dg/historique"   element={<PrivateRoute><DGHistorique /></PrivateRoute>} />

      {/* Toute URL inconnue → login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}