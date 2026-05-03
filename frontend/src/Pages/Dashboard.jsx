import { useState, useEffect } from "react"
import Card from "../component/Card"
import Roles from "../component/Role"
import Sidebar from "../component/SideBar"
import API from "../api/axios"
import { useTheme } from "../hooks/useTheme"

const CURRENT_YEAR = new Date().getFullYear()

export default function Dashboard() {
  const { t } = useTheme()
  const [users, setUsers] = useState([])

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
    <div className={`min-h-screen ${t.pageBg} ${t.textMain} transition-colors duration-300`}>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className={`flex-1 ${t.pageBg} p-6 transition-colors duration-300`}>

          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className={`${t.textSub} mb-6`}>
            Vue d'ensemble du système - Campagne {CURRENT_YEAR}
          </p>

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

          <Roles users={users} />

        </div>
      </div>
    </div>
  )
}