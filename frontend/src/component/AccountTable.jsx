import AccountRow from "./AccountRow"

export default function AccountTable({ users, onDelete, onToggle }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-slate-400 text-xs uppercase text-left border-b border-slate-800">
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