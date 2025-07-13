import React from "react";
import { X } from "lucide-react";
import { Book } from "@/app/types/book";

type EditBookModalProps = {
  open: boolean;
  onClose: () => void;
  form: Partial<Book>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
};

export default function EditBookModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  saving,
}: EditBookModalProps) {
  if (!open) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/50 px-2">
      <div className="bg-parchment border-2 border-book rounded-2xl shadow-xl w-full max-w-lg sm:max-w-md md:max-w-xl mx-auto p-4 sm:p-6 md:p-8 relative animate-fadein">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blood hover:text-gold bg-gold rounded-full p-1"
          type="button"
          aria-label="Fermer"
        >
          <X size={22} />
        </button>
        <h2 className="text-xl font-bold text-blood mb-4 text-center">
          Modifier le livre
        </h2>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <input
            name="title"
            value={form.title ?? ""}
            onChange={onChange}
            placeholder="Titre"
            className="p-2 rounded border border-gold bg-parchment/90"
            required
          />
          <input
            name="author"
            value={form.author ?? ""}
            onChange={onChange}
            placeholder="Auteur (facultatif)"
            className="p-2 rounded border border-gold bg-parchment/90"
          />
          <textarea
            name="summary"
            value={form.summary ?? ""}
            onChange={onChange}
            placeholder="Résumé"
            className="p-2 rounded border border-gold bg-parchment/90"
            rows={3}
            required
          />
          <input
            name="imageUrl"
            value={form.imageUrl ?? ""}
            onChange={onChange}
            placeholder="Lien de l’image (facultatif)"
            className="p-2 rounded border border-gold bg-parchment/90"
          />
          <div className="flex gap-2 mt-2 justify-end">
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
