import { useState, useEffect } from "react"
import Sidebar from "../component/SideBar"
import API from "../api/axios"
import { useTheme } from "../hooks/useTheme"

const typeBadge = {
  "Création":    "bg-green-500/20 text-green-500",
  "Modification":"bg-yellow-500/20 text-yellow-500",
  "Suppression": "bg-red-500/20 text-red-500",
  "Info":        "bg-blue-500/20 text-blue-500",
}

export default function AuditPage() {
  const { t, isLight } = useTheme()
  const [logs, setLogs] = useState([])

  useEffect(() => {
    API.get("/logs").then((res) => setLogs(res.data))
  }, [])

  return (
    <div className={`h-screen ${t.pageBg} ${t.textMain} flex overflow-hidden transition-colors duration-300`}>
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">

        <div className="flex-1 p-6">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">Journaux d'audit</h1>
            <p className={t.textSub}>Historique complet des actions administratives</p>
          </div>

          {/* Table */}
          <div className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${t.cardBg} ${t.border}`}>
            <table className="w-full">

              <thead>
                <tr className={`text-xs uppercase text-left border-b ${t.thead} ${t.border}`}>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Utilisateur concerné</th>
                  <th className="px-6 py-4">Date & Heure</th>
                </tr>
              </thead>

              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={`px-6 py-8 text-center text-sm ${t.textMute}`}>
                      Aucune action enregistrée pour le moment
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log._id}
                      className={`border-b last:border-0 transition-colors ${t.border} ${t.rowHover}`}
                    >
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${typeBadge[log.type] || "bg-slate-500/20 text-slate-400"}`}>
                          {log.type}
                        </span>
                      </td>

                      <td className={`px-6 py-4 text-sm font-medium ${t.textMain}`}>
                        {log.action}
                      </td>

                      <td className={`px-6 py-4 text-sm ${t.textSub}`}>
                        {log.user}
                      </td>

                      <td className={`px-6 py-4 text-sm font-mono ${t.textMute}`}>
                        {new Date(log.createdAt).toLocaleString("fr-FR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    </div>
  )
}