import { useTheme } from "../hooks/useTheme"

export default function AccountHeader({ totalUsers, search, setSearch, onNewUser }) {
  const { t } = useTheme()

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className={`text-4xl font-bold mb-2 ${t.textMain}`}>
          Gestion des comptes
        </h1>
        <p className={t.textSub}>{totalUsers} utilisateurs affichés</p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${t.input}`}
        />
        <button
          onClick={onNewUser}
          className={`px-5 py-3 rounded-xl font-medium transition-colors ${t.btnPrimary}`}
        >
          + Nouveau compte
        </button>
      </div>
    </div>
  )
}