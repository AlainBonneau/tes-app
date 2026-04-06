import type { Region, Creature } from "@/app/types/creatures";

interface EditCreatureModalProps {
  open: boolean;
  onClose: () => void;
  form: Partial<Creature>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  regions: Region[];
}

export default function EditCreatureModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  saving,
  regions,
}: EditCreatureModalProps) {
  if (!open) return null;
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/60">
      <div className="bg-parchment border-2 border-blood p-8 rounded-xl shadow-xl w-full max-w-lg mx-4">
        <h2 className="text-xl font-bold text-blood mb-6">
          Modifier la créature
        </h2>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Nom"
            className="p-2 rounded border border-gold"
            required
          />
          <input
            name="type"
            value={form.type}
            onChange={onChange}
            placeholder="Type"
            className="p-2 rounded border border-gold"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Description"
            className="p-2 rounded border border-gold"
            rows={3}
            required
          />
          <select
            name="regionId"
            value={form.regionId}
            onChange={onChange}
            className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
          >
            <option value="">Sélectionner une région *</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
          <input
            name="imageUrl"
            value={form.imageUrl || ""}
            onChange={onChange}
            placeholder="Lien image"
            className="p-2 rounded border border-gold"
          />
          <div className="flex gap-4 mt-4 justify-end">
            <button
              type="button"
              className="bg-blood text-gold px-4 py-2 rounded hover:bg-blood/80"
              onClick={onClose}
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-gold text-blood px-4 py-2 rounded hover:bg-gold/80 font-bold"
              disabled={saving}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
