import MyButton from "@/app/components/MyButton";

type AdminRegionsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
};

export default function AdminRegionsToolbar({
  search,
  onSearchChange,
  onCreate,
}: AdminRegionsToolbarProps) {
  return (
    <div className="max-w-6xl mx-auto py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <MyButton label="Ajouter une région" onClick={onCreate} />

      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="p-2 border border-sandstone bg-parchment text-blood rounded w-full md:w-64"
        placeholder="Rechercher une région..."
      />
    </div>
  );
}
