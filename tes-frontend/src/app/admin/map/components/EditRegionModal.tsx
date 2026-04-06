import React from "react";
import type { Region } from "@/app/types/region";

type Props = {
  open: boolean;
  onClose: () => void;
  form: Partial<Region>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving?: boolean;
};

export default function EditRegionModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  saving,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-parchment rounded-xl p-8 shadow-xl w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 bg-blood text-gold rounded px-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl mb-4 text-center font-uncial text-blood">
          {form.id ? "Modifier la région" : "Ajouter une région"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border rounded p-2"
            placeholder="Nom"
            name="name"
            value={form.name ?? ""}
            onChange={onChange}
            required
          />
          <input
            className="w-full border rounded p-2"
            placeholder="Image URL"
            name="imageUrl"
            value={form.imageUrl ?? ""}
            onChange={onChange}
          />
          <div className="flex gap-2">
            <input
              className="w-1/2 border rounded p-2"
              placeholder="X"
              type="number"
              name="x"
              value={form.x ?? ""}
              onChange={onChange}
            />
            <input
              className="w-1/2 border rounded p-2"
              placeholder="Y"
              type="number"
              name="y"
              value={form.y ?? ""}
              onChange={onChange}
            />
          </div>
          <textarea
            className="w-full border rounded p-2"
            placeholder="Description"
            name="description"
            value={form.description ?? ""}
            onChange={onChange}
            rows={3}
            required
          />
          <button
            type="submit"
            className="w-full bg-gold hover:bg-sandstone text-blood font-bold py-2 rounded shadow"
            disabled={saving}
          >
            {saving ? "Enregistrement..." : form.id ? "Enregistrer" : "Créer"}
          </button>
        </form>
      </div>
    </div>
  );
}
