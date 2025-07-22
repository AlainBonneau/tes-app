import type { Category } from "@/app/types/category";

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  form: Partial<Category>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}

export default function EditCategoryModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  saving,
}: EditCategoryModalProps) {
  if (!open) return null;
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/60">
      <div className="bg-parchment border-2 border-blood p-8 rounded-xl shadow-xl w-full max-w-lg mx-4">
        <h2 className="text-xl font-bold text-blood mb-6">
          {form.id ? "Modifier la catégorie" : "Ajouter une catégorie"}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <input
            name="name"
            value={form.name || ""}
            onChange={onChange}
            placeholder="Nom"
            className="p-2 rounded border border-gold"
            required
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
              {saving ? "Enregistrement…" : form.id ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
