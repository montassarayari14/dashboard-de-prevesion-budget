import { useState, useEffect } from "react"
import Sidebar from "../component/SideBar"
import API from "../api/axios"

const typeBadge = {
  "Création": "bg-green-500/20 text-green-400",
  "Modification": "bg-yellow-500/20 text-yellow-400",
  "Suppression": "bg-red-500/20 text-red-400",
  "Info": "bg-blue-500/20 text-blue-400",
}

export default function AuditPage() {
  const [logs, setLogs] = useState([])

  // charger les logs depuis le backend
  useEffect(() => {
    API.get("/logs").then((res) => setLogs(res.data))
  }, [])

  return (
    <div className="h-screen bg-[#050b1a] text-white flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">

        <div className="flex-1 p-6">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">Journaux d'audit</h1>
            <p className="text-slate-400">Historique complet des actions administratives</p>
          </div>

          {/* Table */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full">

              <thead>
                <tr className="text-slate-400 text-xs uppercase text-left border-b border-slate-800">
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Utilisateur concerné</th>
                  <th className="px-6 py-4">Date & Heure</th>
                </tr>
              </thead>

              <tbody>
                {logs.length === 0 ? (
                  // aucun log encore
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-sm">
                      Aucune action enregistrée pour le moment
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log._id}
                      className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Badge type */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${typeBadge[log.type] || "bg-slate-700 text-slate-300"}`}>
                          {log.type}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {log.action}
                      </td>

                      {/* Utilisateur */}
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {log.user}
                      </td>

                      {/* Date — formatée depuis MongoDB */}
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono">
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