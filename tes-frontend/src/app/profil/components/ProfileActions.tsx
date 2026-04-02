"use client";

import { motion } from "framer-motion";

type ProfileActionsProps = {
  editMode: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChangePassword: () => void;
};

export default function ProfileActions({
  editMode,
  saving,
  onEdit,
  onSave,
  onCancel,
  onChangePassword,
}: ProfileActionsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-end items-center">
      {!editMode ? (
        <motion.button
          whileHover={{ scale: 1.07, boxShadow: "0px 0px 8px #c9a36b" }}
          className="bg-rune text-gold px-6 py-2 rounded font-bold uppercase tracking-wider shadow hover:brightness-110 transition cursor-pointer"
          onClick={onEdit}
        >
          Modifier le profil
        </motion.button>
      ) : (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-gold text-blood px-6 py-2 rounded font-bold uppercase tracking-wider shadow hover:brightness-110 transition cursor-pointer"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-rune text-gold px-6 py-2 rounded font-bold uppercase tracking-wider shadow hover:brightness-110 transition cursor-pointer"
            onClick={onCancel}
            disabled={saving}
          >
            Annuler
          </motion.button>
        </>
      )}

      <motion.button
        whileHover={{ scale: 1.07, boxShadow: "0px 0px 8px #c9a36b" }}
        className="bg-rune text-gold px-6 py-2 rounded font-bold uppercase tracking-wider shadow hover:brightness-110 transition cursor-pointer"
        onClick={onChangePassword}
      >
        Changer le mot de passe
      </motion.button>
    </div>
  );
}
