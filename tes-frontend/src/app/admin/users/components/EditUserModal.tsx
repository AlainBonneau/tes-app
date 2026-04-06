import { motion } from "framer-motion";
import type { User } from "@/app/types/user";

type Props = {
  open: boolean;
  onClose: () => void;
  form: Partial<User>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
};

export default function EditUserModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  saving,
}: Props) {
  if (!open) return null;

  const birthdateValue = form.birthdate
    ? String(form.birthdate).slice(0, 10)
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      className="fixed inset-0 z-50 bg-dark/80 flex items-center justify-center"
      style={{ minHeight: "100dvh" }} // Pour les mobiles modernes
    >
      <form
        onSubmit={onSubmit}
        className="
          w-[95vw] max-w-md
          max-h-[95vh]
          bg-parchment
          rounded-xl
          shadow-lg
          p-2 sm:p-4 md:p-6
          flex flex-col gap-4 border-2 border-gold
          overflow-auto
        "
        style={{ overscrollBehavior: "contain" }}
      >
        <h2 className="text-xl font-uncial font-bold mb-2 text-blood text-center">
          Modifier l’utilisateur
        </h2>
        {/* Username */}
        <label>
          <span className="font-bold text-blood">Nom d&apos;utilisateur :</span>
          <input
            name="username"
            value={form.username ?? ""}
            onChange={onChange}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </label>
        {/* Email */}
        <label>
          <span className="font-bold text-blood">Email :</span>
          <input
            name="email"
            type="email"
            value={form.email ?? ""}
            onChange={onChange}
            className="w-full border rounded p-2 mt-1"
            required
            disabled
          />
        </label>
        {/* Prénom */}
        <label>
          <span className="font-bold text-blood">Prénom :</span>
          <input
            name="firstName"
            value={form.firstName ?? ""}
            onChange={onChange}
            className="w-full border rounded p-2 mt-1"
            placeholder="Prénom"
          />
        </label>
        {/* Nom */}
        <label>
          <span className="font-bold text-blood">Nom :</span>
          <input
            name="lastName"
            value={form.lastName ?? ""}
            onChange={onChange}
            className="w-full border rounded p-2 mt-1"
            placeholder="Nom"
          />
        </label>
        {/* Image URL */}
        <label>
          <span className="font-bold text-blood">Image (URL) :</span>
          <input
            name="imageUrl"
            type="text"
            value={form.imageUrl ?? ""}
            onChange={onChange}
            className="w-full border rounded p-2 mt-1"
            placeholder="Lien de l'image"
          />
        </label>
        {/* Description */}
        <label>
          <span className="font-bold text-blood">Description :</span>
          <textarea
            name="description"
            value={form.description ?? ""}
            onChange={onChange}
            className="w-full border rounded p-2 mt-1"
            rows={3}
            placeholder="Description"
          />
        </label>
        {/* Date de naissance */}
        <label>
          <span className="font-bold text-blood">Date de naissance :</span>
          <input
            name="birthdate"
            type="date"
            value={birthdateValue}
            onChange={onChange}
            className="w-full border rounded p-2 mt-1"
          />
        </label>
        {/* Rôle */}
        <label>
          <span className="font-bold text-blood">Rôle :</span>
          <select
            name="role"
            value={form.role ?? "user"}
            onChange={onChange}
            className="w-full border rounded p-2 mt-1"
            required
          >
            <option value="user">Utilisateur</option>
            <option value="moderator">Modérateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </label>
        <div className="flex gap-2 justify-center mt-3">
          <button
            type="submit"
            className="bg-gold text-blood font-bold rounded px-4 py-2 hover:bg-gold/90 transition"
            disabled={saving}
          >
            Enregistrer
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-blood text-gold rounded px-4 py-2 hover:bg-blood/90 transition"
            disabled={saving}
          >
            Annuler
          </button>
        </div>
      </form>
    </motion.div>
  );
}
