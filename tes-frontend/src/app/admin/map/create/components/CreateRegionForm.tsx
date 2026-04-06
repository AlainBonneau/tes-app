type CreateRegionFormState = {
  name: string;
  description: string;
  x: string;
  y: string;
  imageUrl: string;
};

type CreateRegionFormProps = {
  form: CreateRegionFormState;
  error: string;
  saving: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function CreateRegionForm({
  form,
  error,
  saving,
  onChange,
  onSubmit,
}: CreateRegionFormProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <form
        className="
          w-full max-w-3xl
          bg-blood/95
          mb-10
          border-2 border-gold
          rounded-2xl
          shadow-2xl
          p-6 md:p-10
          flex flex-col gap-5
          backdrop-blur-md
        "
        onSubmit={onSubmit}
      >
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Nom de la région *"
          className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Description *"
          className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
          rows={3}
          required
        />

        <div className="flex flex-col md:flex-row gap-4">
          <input
            name="x"
            type="number"
            value={form.x}
            onChange={onChange}
            placeholder="Coordonnée X (optionnel)"
            className="flex-1 p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
          />

          <input
            name="y"
            type="number"
            value={form.y}
            onChange={onChange}
            placeholder="Coordonnée Y (optionnel)"
            className="flex-1 p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
          />
        </div>

        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={onChange}
          placeholder="Lien image (optionnel)"
          className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
        />

        {error && (
          <div className="text-red-600 text-center mb-2 font-semibold bg-parchment/80 rounded-lg py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="
            mt-4
            bg-gold
            text-blood
            px-4 py-3
            rounded-xl
            font-bold
            text-lg
            shadow-lg
            hover:bg-gold/90
            hover:scale-105
            transition
            tracking-widest
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {saving ? "Création..." : "Créer la région"}
        </button>
      </form>
    </div>
  );
}
