"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AvatarUploader from "../../components/AvatarUploader";
import ProfileActions from "./ProfileActions";

type ProfileFormSectionProps = {
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  registrationDate: string;
  role: string;
  avatar: string;
  description: string;
  editMode: boolean;
  saving: boolean;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  setBirthdate: React.Dispatch<React.SetStateAction<string>>;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChangePassword: () => void;
};

export default function ProfileFormSection({
  email,
  firstName,
  lastName,
  birthdate,
  registrationDate,
  role,
  avatar,
  description,
  editMode,
  saving,
  setFirstName,
  setLastName,
  setBirthdate,
  setAvatar,
  setDescription,
  onEdit,
  onSave,
  onCancel,
  onChangePassword,
}: ProfileFormSectionProps) {
  return (
    <motion.section
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      className="bg-blood p-6 rounded-2xl shadow-xl w-full md:w-2/3 flex flex-col gap-6 border-2 border-sandstone text-parchment"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block font-semibold mb-1 text-gold">Nom</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border border-sandstone bg-parchment text-blood rounded"
            readOnly={!editMode}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gold">Prénom</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border border-sandstone bg-parchment text-blood rounded"
            readOnly={!editMode}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gold">Email</label>
          <input
            type="email"
            value={email}
            className="w-full p-2 border border-sandstone bg-parchment text-blood rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gold">
            Date de naissance
          </label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full p-2 border border-sandstone bg-parchment text-blood rounded"
            readOnly={!editMode}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gold">Rôle</label>
          <input
            type="text"
            value={role}
            className="w-full p-2 border border-sandstone bg-parchment text-blood rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gold">
            Date d&apos;inscription
          </label>
          <input
            type="date"
            value={registrationDate}
            className="w-full p-2 border border-sandstone bg-parchment text-blood rounded"
            readOnly
          />
        </div>

        <div className="md:col-span-2 flex flex-col items-center">
          <label className="block font-semibold mb-1 text-gold">
            Photo de profil
          </label>

          {editMode ? (
            <>
              <AvatarUploader onUploaded={setAvatar} />
              {avatar && (
                <Image
                  width={96}
                  height={96}
                  src={avatar}
                  alt="Aperçu de l'avatar"
                  className="w-24 h-24 rounded-full mt-2 object-cover"
                />
              )}
            </>
          ) : (
            <input
              type="url"
              value={avatar}
              readOnly
              className="w-full p-2 border border-sandstone bg-parchment text-blood rounded"
              placeholder="https://..."
            />
          )}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1 text-gold">
          Description
        </label>
        <textarea
          rows={4}
          className="w-full p-2 border border-sandstone bg-parchment text-blood rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          readOnly={!editMode}
        />
      </div>

      <ProfileActions
        editMode={editMode}
        saving={saving}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        onChangePassword={onChangePassword}
      />
    </motion.section>
  );
}
