"use client";

import { useState } from "react";
import axios from "axios";
import { useToast } from "@/app/context/ToastContext";
import AuthGuard from "@/app/components/AuthGuard";
import api from "@/app/api/axiosConfig";
import { useRouter } from "next/navigation";
import CreateRegionHeader from "./components/CreateRegionHeader";
import CreateRegionForm from "./components/CreateRegionForm";

type CreateRegionFormState = {
  name: string;
  description: string;
  x: string;
  y: string;
  imageUrl: string;
};

export default function CreateRegionPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState<CreateRegionFormState>({
    name: "",
    description: "",
    x: "",
    y: "",
    imageUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        description: form.description,
        x: form.x ? Number(form.x) : 0,
        y: form.y ? Number(form.y) : 0,
        imageUrl: form.imageUrl || null,
      };

      const response = await api.post("/regions", payload, {
        withCredentials: true,
      });

      if (response.status === 201) {
        showToast("Région créée avec succès", "success");
        router.push("/admin/map");
        return;
      }

      const message = "Une erreur inconnue est survenue.";
      setError(message);
      showToast("Erreur lors de la création de la région", "error");
    } catch (err) {
      console.error("Erreur lors de la création de la région :", err);

      let message = "Erreur lors de la création";

      if (axios.isAxiosError(err)) {
        if (
          err.response?.data?.errors &&
          Array.isArray(err.response.data.errors)
        ) {
          message = err.response.data.errors.join(", ");
        } else {
          message = err.response?.data?.error || message;
        }
      }

      setError(message);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-parchment flex flex-col items-center">
        <CreateRegionHeader title="Administration – Création d’une région" />

        <CreateRegionForm
          form={form}
          error={error}
          saving={saving}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </AuthGuard>
  );
}
