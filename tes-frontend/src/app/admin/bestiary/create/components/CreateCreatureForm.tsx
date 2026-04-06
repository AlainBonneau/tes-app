import Loader from "@/app/components/Loader";
import type { Region } from "@/app/types/creatures";

type CreateCreatureFormState = {
  name: string;
  type: string;
  description: string;
  regionId: string;
  imageUrl: string;
};

type CreateCreatureFormProps = {
  form: CreateCreatureFormState;
  regions: Region[];
  error: string;
  saving: boolean;
  loadingRegions: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function CreateCreatureForm({
  form,
  regions,
  error,
  saving,
  loadingRegions,
  onChange,
  onSubmit,
}: CreateCreatureFormProps) {
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
          placeholder="Nom *"
          className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
          required
        />

        <input
          name="type"
          value={form.type}
          onChange={onChange}
          placeholder="Type *"
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

        {loadingRegions ? (
          <div className="flex justify-center py-4">
            <Loader text="Chargement des régions..." />
          </div>
        ) : (
          <select
            name="regionId"
            value={form.regionId}
            onChange={onChange}
            className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
            required
          >
            <option value="">Sélectionner une région *</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        )}

        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={onChange}
          placeholder="Lien image"
          className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
        />

        {error && (
          <div className="text-red-600 text-center mb-2 font-semibold bg-parchment/80 rounded-lg py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving || loadingRegions}
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
          {saving ? "Création..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
