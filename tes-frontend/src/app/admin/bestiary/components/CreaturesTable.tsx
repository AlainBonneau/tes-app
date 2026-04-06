import type { Creature } from "@/app/types/creatures";

type CreaturesTableProps = {
  creatures: Creature[];
  onEdit: (creature: Creature) => void;
  onDelete: (id: number) => void;
};

export default function CreaturesTable({
  creatures,
  onEdit,
  onDelete,
}: CreaturesTableProps) {
  return (
    <div className="hidden sm:block w-full overflow-x-auto">
      <table className="min-w-full border border-gold shadow-lg rounded-xl bg-parchment">
        <thead className="bg-blood text-gold">
          <tr>
            <th className="py-2 px-3">Nom</th>
            <th className="py-2 px-3">Type</th>
            <th className="py-2 px-3">Région</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {creatures.map((creature) => (
            <tr
              key={creature.id}
              className="border-t hover:bg-gold/20 transition text-center"
            >
              <td className="py-2 px-3 font-bold">{creature.name}</td>
              <td className="py-2 px-3">{creature.type}</td>
              <td className="py-2 px-3">{creature.region?.name ?? "-"}</td>
              <td className="py-2 px-3 flex gap-2 justify-center">
                <button
                  className="px-3 py-1 bg-blood text-gold rounded hover:bg-blood/80 text-xs cursor-pointer"
                  onClick={() => onEdit(creature)}
                >
                  Éditer
                </button>

                <button
                  className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
                  onClick={() => onDelete(creature.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}

          {creatures.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-blood">
                Aucun monstre trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
