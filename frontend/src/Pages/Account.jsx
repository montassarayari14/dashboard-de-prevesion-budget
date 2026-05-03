import Sidebar from "../component/SideBar"
import AccountHeader from "../component/AccountHeader"
import AccountTable from "../component/AccountTable"
import AddUser from "../component/AddUser"
import API from "../api/axios"
import { useState, useEffect } from "react"
import { useTheme } from "../hooks/useTheme"

export default function AccountPage() {
  const { t } = useTheme()

  const [users, setUsers] = useState([])
  const [showUser, setShowUser] = useState(false)
  const [search, setSearch] = useState("")
  const [newUser, setNewUser] = useState({
    nom: "", prenom: "", email: "", role: "Directeur", direction: ""
  })

  useEffect(() => {
    API.get("/users").then((res) => setUsers(res.data))
  }, [])

  async function adUser() {
    const res = await API.post("/users", newUser)
    setUsers([...users, res.data])
    setShowUser(false)
    setNewUser({ nom: "", prenom: "", email: "", role: "Directeur", direction: "" })
  }

  async function deleteUser(id) {
    await API.delete(`/users/${id}`)
    setUsers(users.filter((u) => u._id !== id))
  }

  async function toggleStatus(id) {
    const res = await API.put(`/users/${id}/toggle`)
    setUsers(users.map((u) => u._id === id ? res.data : u))
  }

  function close() {
    setShowUser(false)
    setNewUser({ nom: "", prenom: "", email: "", role: "Directeur", direction: "" })
  }

  const filterUsers = users.filter((u) =>
    `${u.prenom} ${u.nom}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`min-h-screen ${t.pageBg} ${t.textMain} transition-colors duration-300`}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <AccountHeader
            totalUsers={filterUsers.length}
            search={search}
            setSearch={setSearch}
            onNewUser={() => setShowUser(true)}
          />
          <AccountTable
            users={filterUsers}
            onDelete={deleteUser}
            onToggle={toggleStatus}
          />
        </div>
      </div>

      <AddUser
        show={showUser}
        onClose={close}
        newUser={newUser}
        setNewUser={setNewUser}
        onAdd={adUser}
      />
    </div>
  )
}