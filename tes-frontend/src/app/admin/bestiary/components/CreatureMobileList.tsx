import type { Creature } from "@/app/types/creatures";

type CreaturesMobileListProps = {
  creatures: Creature[];
  onEdit: (creature: Creature) => void;
  onDelete: (id: number) => void;
};

export default function CreaturesMobileList({
  creatures,
  onEdit,
  onDelete,
}: CreaturesMobileListProps) {
  return (
    <div className="block sm:hidden space-y-4 mt-4 px-2">
      {creatures.length === 0 && (
        <div className="text-center py-4 text-blood bg-parchment rounded-xl border border-gold">
          Aucun monstre trouvé.
        </div>
      )}

      {creatures.map((creature) => (
        <div
          key={creature.id}
          className="rounded-xl bg-parchment border border-gold p-4 shadow flex flex-col gap-2"
        >
          <div>
            <span className="font-bold text-blood">ID:</span> {creature.id}
          </div>

          <div>
            <span className="font-bold text-blood">Nom:</span> {creature.name}
          </div>

          <div>
            <span className="font-bold text-blood">Type:</span> {creature.type}
          </div>

          <div>
            <span className="font-bold text-blood">Région:</span>{" "}
            {creature.region?.name ?? "-"}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 px-2 py-2 bg-blood text-gold rounded hover:bg-blood/80 text-xs cursor-pointer"
              onClick={() => onEdit(creature)}
            >
              Éditer
            </button>

            <button
              className="flex-1 px-2 py-2 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
              onClick={() => onDelete(creature.id)}
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
