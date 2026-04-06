import Image from "next/image";
import type { Region } from "@/app/types/region";

type RegionsTableProps = {
  regions: Region[];
  onEdit: (region: Region) => void;
  onDelete: (id: number) => void;
};

export default function RegionsTable({
  regions,
  onEdit,
  onDelete,
}: RegionsTableProps) {
  return (
    <div className="hidden sm:block w-full overflow-x-auto">
      <table className="min-w-full border border-gold shadow-lg rounded-xl bg-parchment">
        <thead className="bg-blood text-gold">
          <tr>
            <th className="py-2 px-3">Nom</th>
            <th className="py-2 px-3">X</th>
            <th className="py-2 px-3">Y</th>
            <th className="py-2 px-3">Image</th>
            <th className="py-2 px-3">Description</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {regions.map((region) => (
            <tr
              key={region.id}
              className="border-t text-center hover:bg-gold/20 transition"
            >
              <td className="py-2 px-3 font-bold">{region.name}</td>
              <td className="py-2 px-3">{region.x}</td>
              <td className="py-2 px-3">{region.y}</td>

              <td className="py-2 px-3">
                {region.imageUrl ? (
                  <Image
                    width={48}
                    height={48}
                    src={region.imageUrl}
                    alt={`Illustration de ${region.name}`}
                    className="w-12 h-12 object-cover rounded border border-gold"
                  />
                ) : (
                  <span className="text-gray-400 italic">-</span>
                )}
              </td>

              <td className="py-2 px-3">
                {region.description
                  ? `${region.description.slice(0, 60)}...`
                  : "-"}
              </td>

              <td className="py-2 px-3 flex gap-2 justify-center">
                <button
                  className="px-3 py-1 bg-blood text-gold rounded hover:bg-blood/80 text-xs cursor-pointer"
                  onClick={() => onEdit(region)}
                >
                  Éditer
                </button>

                <button
                  className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
                  onClick={() => onDelete(region.id!)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}

          {regions.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-blood">
                Aucune région trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
