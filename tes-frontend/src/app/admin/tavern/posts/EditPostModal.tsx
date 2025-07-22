import type { Category } from "@/app/types/category";
import type { Post } from "@/app/types/post";

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  form: Partial<Post> & { categoryId?: number | string };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  categories: Category[];
}

export default function EditPostModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  saving,
  categories,
}: EditPostModalProps) {
  if (!open) return null;
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/60">
      <div className="bg-parchment border-2 border-blood p-8 rounded-xl shadow-xl w-full max-w-lg mx-4">
        <h2 className="text-xl font-bold text-blood mb-6">Modifier le sujet</h2>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <input
            name="title"
            value={form.title || ""}
            onChange={onChange}
            placeholder="Titre"
            className="p-2 rounded border border-gold"
            required
          />
          <textarea
            name="content"
            value={form.content || ""}
            onChange={onChange}
            placeholder="Contenu"
            className="p-2 rounded border border-gold"
            rows={4}
            required
          />
          <select
            name="categoryId"
            value={form.categoryId ?? ""}
            onChange={onChange}
            className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
            required
          >
            <option value="">Sélectionner une catégorie *</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
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
