import MyButton from "@/app/components/MyButton";

type AdminBestiaryToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
};

export default function AdminBestiaryToolbar({
  search,
  onSearchChange,
  onCreate,
}: AdminBestiaryToolbarProps) {
  return (
    <>
      <div className="max-w-6xl mx-auto py-8 flex justify-center items-center">
        <MyButton label="Ajouter une créature" onClick={onCreate} />
      </div>

      <div className="w-full">
        <div className="flex justify-end items-center p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="p-2 border border-sandstone bg-parchment text-blood rounded"
            placeholder="Rechercher une créature..."
          />
        </div>
      </div>
    </>
  );
}
