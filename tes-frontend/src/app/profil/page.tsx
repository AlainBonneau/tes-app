"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/app/store";
import { useToast } from "../context/ToastContext";
import AuthGuard from "../components/AuthGuard";
import api from "../api/axiosConfig";
import ProfileHeader from "./components/ProfileHeader";
import ProfileSidebarCard from "./components/ProfileSidebarCard";
import ProfileFormSection from "./components/ProfileFormSection";

type EditableProfile = {
  firstName: string;
  lastName: string;
  birthdate: string;
  imageUrl: string;
  description: string;
};

type UserProfileResponse = {
  email: string;
  username: string;
  birthdate?: string | null;
  createdAt: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  role?: string | null;
};

export default function ProfilePage() {
  const auth = useSelector((state: RootState) => state.auth);
  const isLoggedIn = auth.isAuthenticated;
  const { showToast } = useToast();

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
  const [saving, setSaving] = useState(false);
  const [originalProfile, setOriginalProfile] =
    useState<EditableProfile | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await api.get<UserProfileResponse>("/users/me", {
          withCredentials: true,
        });

        const user = response.data;

        const normalizedProfile: EditableProfile = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          birthdate: user.birthdate ? user.birthdate.split("T")[0] : "",
          imageUrl: user.imageUrl || "",
          description: user.description || "",
        };

        setEmail(user.email);
        setUsername(user.username);
        setBirthdate(normalizedProfile.birthdate);
        setRegistrationDate(user.createdAt.split("T")[0]);
        setFirstName(normalizedProfile.firstName);
        setLastName(normalizedProfile.lastName);
        setAvatar(normalizedProfile.imageUrl);
        setDescription(normalizedProfile.description);
        setRole(user.role || "Utilisateur");
        setOriginalProfile(normalizedProfile);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          err,
        );
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  const handleCancel = () => {
    if (!originalProfile) return;

    setFirstName(originalProfile.firstName);
    setLastName(originalProfile.lastName);
    setBirthdate(originalProfile.birthdate);
    setAvatar(originalProfile.imageUrl);
    setDescription(originalProfile.description);
    setEditMode(false);
  };

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
          withCredentials: true,
        },
      );

      const updatedProfile: EditableProfile = {
        firstName,
        lastName,
        birthdate,
        imageUrl: avatar,
        description,
      };

      const hasChanges =
        firstName !== originalProfile?.firstName ||
        lastName !== originalProfile?.lastName ||
        birthdate !== originalProfile?.birthdate ||
        avatar !== originalProfile?.imageUrl ||
        description !== originalProfile?.description;

      setOriginalProfile(updatedProfile);

      if (hasChanges) {
        showToast("Modifications enregistrées avec succès !", "success");
      }

      setEditMode(false);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des modifications :", err);

      if (axios.isAxiosError(err)) {
        showToast(
          err.response?.data?.error || "Erreur lors de l'enregistrement.",
          "error",
        );
      } else {
        showToast("Une erreur est survenue lors de l'enregistrement.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gold text-[#3A2E1E] font-serif">
        <ProfileHeader title="Profil" />

        <section className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-8 items-center mt-8">
          <ProfileSidebarCard avatar={avatar} role={role} username={username} />

          <ProfileFormSection
            email={email}
            firstName={firstName}
            lastName={lastName}
            birthdate={birthdate}
            registrationDate={registrationDate}
            role={role}
            avatar={avatar}
            description={description}
            editMode={editMode}
            saving={saving}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setBirthdate={setBirthdate}
            setAvatar={setAvatar}
            setDescription={setDescription}
            onEdit={() => setEditMode(true)}
            onSave={handleSave}
            onCancel={handleCancel}
            onChangePassword={() =>
              showToast("Fonctionnalité à venir !", "info")
            }
          />
        </section>
      </div>
    </AuthGuard>
  );
}
