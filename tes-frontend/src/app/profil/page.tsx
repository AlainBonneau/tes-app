"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useRouter } from "next/navigation";
import api from "../api/axiosConfig";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<{
    firstName: string;
    lastName: string;
    birthdate: string;
    imageUrl: string;
    description: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const auth = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!auth.token;

  // Récupération des données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const user = response.data;
        setEmail(user.email);
        setUsername(user.username);
        setBirthdate(user.birthdate ? user.birthdate.split("T")[0] : "");
        setRegistrationDate(user.createdAt.split("T")[0]);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setAvatar(user.imageUrl || "");
        setDescription(user.description || "");
        setRole(user.role || "Utilisateur");
        setOriginalProfile({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          birthdate: user.birthdate ? user.birthdate.split("T")[0] : "",
          imageUrl: user.imageUrl || "",
          description: user.description || "",
        });
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          err
        );
      }
    };
    fetchUserData();
  }, [auth.token, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // Gérer l'annulation de l'édition
  const handleCancel = () => {
    if (!originalProfile) return;
    setFirstName(originalProfile.firstName);
    setLastName(originalProfile.lastName);
    setBirthdate(originalProfile.birthdate);
    setAvatar(originalProfile.imageUrl);
    setDescription(originalProfile.description);
    setEditMode(false);
  };

  // Enregistrer les modifications
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(
        "/users/me",
        {
          firstName,
          lastName,
          birthdate,
          imageUrl: avatar,
          description,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setOriginalProfile({
        firstName,
        lastName,
        birthdate,
        imageUrl: avatar,
        description,
      });
      setEditMode(false);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des modifications:", err);
      alert(
        "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold via-parchment to-[#3a2e1e] text-[#3A2E1E] font-serif">
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Profil
        </h1>
      </div>

      <section className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-8 items-center mt-8">
        {/* Avatar et Badge */}
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="flex flex-col items-center bg-[#fff5dfcc] p-6 rounded-2xl shadow-xl w-full md:w-1/3 border-2 border-sandstone relative"
        >
          <div className="w-32 h-32 rounded-full border-4 border-gold overflow-hidden mb-3 bg-[#d3ba89] shadow-md">
            <Image
              width={128}
              height={128}
              src={avatar || "/assets/default-profile-picture.jpg"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bg-gold px-4 py-1 rounded-xl font-bold text-[#2B1B10] mb-2 mt-1 shadow"
          >
            {role}
          </motion.div>
          <div className="text-xl font-extrabold tracking-wider mb-1">
            {username}
          </div>
          <p className="text-center text-sm italic mb-2">
            Aventurier et érudit du passé, toujours en quête de connaissances
            anciennes.
          </p>
        </motion.section>

        {/* Informations détaillées */}
        <motion.section
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="bg-[#fff5dfcc] p-6 rounded-2xl shadow-xl w-full md:w-2/3 flex flex-col gap-6 border-2 border-sandstone"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-semibold mb-1">Nom</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border border-sandstone bg-white rounded"
                readOnly={!editMode}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border border-sandstone bg-white rounded"
                readOnly={!editMode}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                className="w-full p-2 border border-sandstone bg-white rounded"
                readOnly
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Date de naissance
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full p-2 border border-sandstone bg-white rounded"
                readOnly={!editMode}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Rôle</label>
              <input
                type="text"
                value={role}
                className="w-full p-2 border border-sandstone bg-white rounded"
                readOnly
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Date d&apos;inscription
              </label>
              <input
                type="date"
                value={registrationDate}
                className="w-full p-2 border border-sandstone bg-white rounded"
                readOnly
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">
                Photo de profil (lien)
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full p-2 border border-sandstone bg-white rounded"
                readOnly={!editMode}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              rows={4}
              className="w-full p-2 border border-sandstone bg-white rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              readOnly={!editMode}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-end items-center">
            {!editMode ? (
              <motion.button
                whileHover={{ scale: 1.07, boxShadow: "0px 0px 8px #a17447" }}
                className="bg-rune text-[#E1C699] px-6 py-2 rounded font-bold uppercase tracking-wider shadow hover:brightness-110 transition cursor-pointer"
                onClick={() => setEditMode(true)}
              >
                Modifier le profil
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-gold text-blood px-6 py-2 rounded font-bold uppercase tracking-wider shadow hover:brightness-110 transition cursor-pointer"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-rune text-[#E1C699] px-6 py-2 rounded font-bold uppercase tracking-wider shadow hover:brightness-110 transition cursor-pointer"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Annuler
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.07, boxShadow: "0px 0px 8px #a17447" }}
              className="bg-rune text-[#E1C699] px-6 py-2 rounded font-bold uppercase tracking-wider shadow hover:brightness-110 transition cursor-pointer"
              onClick={() => alert("Fonctionnalité à venir !")}
            >
              Changer le mot de passe
            </motion.button>
          </div>
        </motion.section>
      </section>
    </div>
  );
}
