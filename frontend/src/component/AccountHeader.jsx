export default function AccountHeader({ totalUsers, search, setSearch,onNewUser }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1  className="text-4xl font-bold text-white mb-2">
          Gestion des comptes
        </h1>
        <p className="text-slate-400">{totalUsers} utilisateurs affichés</p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none"
        />

        <button onClick={onNewUser} className="bg-indigo-500 hover:bg-indigo-600 px-5 py-3 rounded-xl font-medium">
          + Nouveau compte
        </button>
      </div>
    </div>
  )
}