import Image from "next/image";
import type { Region } from "@/app/types/region";

type RegionsMobileListProps = {
  regions: Region[];
  onEdit: (region: Region) => void;
  onDelete: (id: number) => void;
};

export default function RegionsMobileList({
  regions,
  onEdit,
  onDelete,
}: RegionsMobileListProps) {
  return (
    <div className="block sm:hidden space-y-4 mt-4 px-2">
      {regions.length === 0 && (
        <div className="text-center py-4 text-blood bg-parchment rounded-xl border border-gold">
          Aucune région trouvée.
        </div>
      )}

      {regions.map((region) => (
        <div
          key={region.id}
          className="rounded-xl bg-parchment border border-gold p-4 shadow flex flex-col gap-2"
        >
          <div>
            <span className="font-bold text-blood">Nom:</span> {region.name}
          </div>

          <div>
            <span className="font-bold text-blood">X:</span> {region.x}
          </div>

          <div>
            <span className="font-bold text-blood">Y:</span> {region.y}
          </div>

          <div>
            <span className="font-bold text-blood">Image:</span>{" "}
            {region.imageUrl ? (
              <Image
                width={64}
                height={64}
                src={region.imageUrl}
                alt={`Illustration de ${region.name}`}
                className="w-16 h-16 object-cover rounded border border-gold inline-block"
              />
            ) : (
              <span className="text-gray-400 italic">-</span>
            )}
          </div>

          <div>
            <span className="font-bold text-blood">Description:</span>{" "}
            {region.description ? `${region.description.slice(0, 60)}...` : "-"}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 px-2 py-2 bg-blood text-gold rounded hover:bg-blood/80 text-xs cursor-pointer"
              onClick={() => onEdit(region)}
            >
              Éditer
            </button>

            <button
              className="flex-1 px-2 py-2 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
              onClick={() => onDelete(region.id!)}
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
