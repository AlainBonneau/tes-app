import type { User } from "@/app/types/user";

type UsersTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onDeleteAllContent: (id: number) => void;
};

export default function UsersTable({
  users,
  onEdit,
  onDelete,
  onDeleteAllContent,
}: UsersTableProps) {
  return (
    <div className="hidden sm:block w-full overflow-x-auto">
      <table className="min-w-full border border-gold shadow-lg rounded-xl bg-parchment">
        <thead className="bg-blood text-gold">
          <tr>
            <th className="py-2 px-3">Nom d&apos;utilisateur</th>
            <th className="py-2 px-3">Email</th>
            <th className="py-2 px-3">Rôle</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t text-center hover:bg-gold/20 transition"
            >
              <td className="py-2 px-3 font-bold">{user.username}</td>
              <td className="py-2 px-3">{user.email}</td>
              <td className="py-2 px-3">{user.role}</td>
              <td className="py-2 px-3 flex gap-2 justify-center">
                <button
                  className="px-3 py-1 bg-blood text-gold rounded hover:bg-blood/80 text-xs cursor-pointer"
                  onClick={() => onEdit(user)}
                >
                  Éditer
                </button>

                <button
                  className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
                  onClick={() => onDeleteAllContent(user.id)}
                >
                  Tout supprimer
                </button>

                <button
                  className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
                  onClick={() => onDelete(user.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-blood">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
