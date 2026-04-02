import Loader from "@/app/components/Loader";
import RichTextEditor from "@/app/components/RichTextEditor";
import type { Category } from "@/app/types/category";

type NewTopicFormProps = {
  error: string | null;
  categories: Category[];
  loadingCategories: boolean;
  categorySlug: string;
  title: string;
  content: string;
  submitting: boolean;
  onCategoryChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function NewTopicForm({
  error,
  categories,
  loadingCategories,
  categorySlug,
  title,
  content,
  submitting,
  onCategoryChange,
  onTitleChange,
  onContentChange,
  onSubmit,
}: NewTopicFormProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-3">
      <form
        onSubmit={onSubmit}
        className="bg-parchment border-2 border-[#523211] rounded-2xl shadow-xl px-6 py-8 flex flex-col gap-6"
      >
        {error && (
          <div className="text-red-700 bg-red-100 border border-red-300 rounded px-4 py-2 font-semibold">
            {error}
          </div>
        )}

        <div>
          <label className="font-bold mb-1 block">Catégorie</label>

          {loadingCategories ? (
            <div className="flex justify-center py-4">
              <Loader />
            </div>
          ) : (
            <select
              className="border border-gold rounded px-3 py-2 w-full bg-parchment text-blood font-semibold"
              value={categorySlug}
              onChange={(e) => onCategoryChange(e.target.value)}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="font-bold mb-1 block">Titre</label>
          <input
            className="border border-gold rounded px-3 py-2 w-full bg-parchment text-blood font-semibold"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            minLength={3}
            maxLength={128}
            required
            placeholder="Donnez un titre explicite à votre sujet"
            autoFocus
          />
        </div>

        <div>
          <label className="font-bold mb-1 block">Message</label>
          <RichTextEditor value={content} onChange={onContentChange} />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || loadingCategories}
            className="bg-blood text-gold font-bold px-8 py-2 rounded-xl border border-gold shadow hover:bg-blood/90 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? "Création..." : "Publier"}
          </button>
        </div>
      </form>
    </div>
  );
}
