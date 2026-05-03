import { useTheme } from "../hooks/useTheme"
import AccountRow from "./AccountRow"

export default function AccountTable({ users, onDelete, onToggle }) {
  const { t } = useTheme()

  return (
    <table className="w-full">
      <thead>
        <tr className={`text-xs uppercase text-left border-b ${t.thead} ${t.border}`}>
          <th className="pb-3 pl-4">Nom</th>
          <th className="pb-3">Email</th>
          <th className="pb-3">Rôle</th>
          <th className="pb-3">Direction</th>
          <th className="pb-3">Statut</th>
          <th className="pb-3">Créé le</th>
          <th className="pb-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <AccountRow
            key={user._id}
            user={user}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))}
      </tbody>
    </table>
  )
}