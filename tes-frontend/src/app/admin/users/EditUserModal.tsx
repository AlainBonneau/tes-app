import { motion } from "framer-motion";
import type { User } from "@/app/types/user";

type Props = {
  open: boolean;
  onClose: () => void;
  form: Partial<User>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      className="fixed inset-0 z-50 bg-dark/80 flex items-center justify-center"
    >
      <form
        onSubmit={onSubmit}
        className="bg-parchment rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-4 border-2 border-gold"
      >
        <h2 className="text-xl font-uncial font-bold mb-2 text-blood text-center">
          Modifier l’utilisateur
        </h2>
        <label>
          <span className="font-bold text-blood">Nom d&apos;utilisateur :</span>
          <input
            name="username"
            value={form.username ?? ""}
            onChange={onChange}
            className="w-full border rounded p-2 mt-1"
            required
            disabled
          />
        </label>
        <label>
          <span className="font-bold text-blood">Email :</span>
          <input
            name="email"
            value={form.email ?? ""}
            onChange={onChange}
            className="w-full border rounded p-2 mt-1"
            required
            disabled
          />
        </label>
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
