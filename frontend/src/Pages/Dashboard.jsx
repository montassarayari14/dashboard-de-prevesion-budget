import { useState, useEffect } from "react"
import Card from "../component/Card"
import Roles from "../component/Role"
import Sidebar from "../component/SideBar"
import API from "../api/axios"

export default function Dashboard() {
  const [users, setUsers] = useState([])

  // charger depuis le backend au lieu de localStorage
  useEffect(() => {
    API.get("/users").then((res) => setUsers(res.data))
  }, [])

  const totalUsers    = users.length
  const activeUsers   = users.filter((u) => u.status == "actif").length
  const inactiveUsers = users.filter((u) => u.status == "inactif").length
  const totalDirections = new Set(
    users.map((u) => u.direction).filter((d) => d && d != "-")
  ).size

  return (
    <div className="min-h-screen bg-[#050b1a] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 bg-[#060b16] p-6">

          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-slate-400 mb-6">
            Vue d'ensemble du système - Campagne 2024
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
            <Card
              title="UTILISATEURS"
              value={totalUsers}
              text={`${activeUsers} actifs — ${inactiveUsers} inactifs`}
              color="text-blue-400"
            />
            <Card
              title="DIRECTIONS"
              value={totalDirections}
              text="Enregistrées"
              color="text-green-400"
            />
            <Card
              title="COMPTES INACTIFS"
              value={inactiveUsers}
              text="À vérifier"
              color="text-red-400"
            />
          </div>

          {/* Répartition des rôles */}
          <Roles users={users} />

        </div>
      </div>
    </div>
  )
}