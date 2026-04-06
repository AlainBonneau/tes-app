type AdminUsersToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function AdminUsersToolbar({
  search,
  onSearchChange,
}: AdminUsersToolbarProps) {
  return (
    <div className="max-w-6xl mx-auto py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="p-2 border border-sandstone bg-parchment text-blood rounded w-full md:w-64"
        placeholder="Rechercher un utilisateur…"
      />
    </div>
  );
}
