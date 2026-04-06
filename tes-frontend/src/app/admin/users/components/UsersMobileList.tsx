import type { User } from "@/app/types/user";

type UsersMobileListProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onDeleteAllContent: (id: number) => void;
};

export default function UsersMobileList({
  users,
  onEdit,
  onDelete,
  onDeleteAllContent,
}: UsersMobileListProps) {
  return (
    <div className="block sm:hidden space-y-4 mt-4 px-2">
      {users.length === 0 && (
        <div className="text-center py-4 text-blood bg-parchment rounded-xl border border-gold">
          Aucun utilisateur trouvé.
        </div>
      )}

      {users.map((user) => (
        <div
          key={user.id}
          className="rounded-xl bg-parchment border border-gold p-4 shadow flex flex-col gap-2"
        >
          <div>
            <span className="font-bold text-blood">Nom :</span> {user.username}
          </div>

          <div>
            <span className="font-bold text-blood">Email :</span> {user.email}
          </div>

          <div>
            <span className="font-bold text-blood">Rôle :</span> {user.role}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 px-2 py-2 bg-blood text-gold rounded hover:bg-blood/80 text-xs cursor-pointer"
              onClick={() => onEdit(user)}
            >
              Éditer
            </button>

            <button
              className="flex-1 px-2 py-2 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
              onClick={() => onDeleteAllContent(user.id)}
            >
              Tout supprimer
            </button>

            <button
              className="flex-1 px-2 py-2 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
              onClick={() => onDelete(user.id)}
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
