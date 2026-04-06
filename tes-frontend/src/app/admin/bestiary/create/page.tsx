"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import { useToast } from "@/app/context/ToastContext";
import { useServices } from "@/app/context/ServicesContext";
import type { Region } from "@/app/types/creatures";
import CreateCreatureHeader from "./components/CreateCreatureHeader";
import CreateCreatureForm from "./components/CreateCreatureForm";

type CreateCreatureFormState = {
  name: string;
  type: string;
  description: string;
  regionId: string;
  imageUrl: string;
};

export default function CreateCreaturePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { bestiaryService, mapService } = useServices();

  const [form, setForm] = useState<CreateCreatureFormState>({
    name: "",
    type: "",
    description: "",
    regionId: "",
    imageUrl: "",
  });

  const [regions, setRegions] = useState<Region[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegions = async () => {
      setLoadingRegions(true);

      try {
        const regions = await mapService.listRegions<Region[]>();
        setRegions(regions);
      } catch (err) {
        console.error("Erreur de chargement des régions :", err);

        const message = axios.isAxiosError(err)
          ? err.response?.data?.error || "Erreur lors du chargement des régions"
          : "Erreur lors du chargement des régions";

        setError(message);
        showToast(message, "error");
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegions();
  }, [showToast, mapService]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
        ...form,
        regionId: form.regionId ? Number(form.regionId) : undefined,
      };

      await bestiaryService.createCreature(payload);
      showToast("Créature créée avec succès !", "success");
      router.push("/admin/bestiary");
    } catch (err) {
      console.error("Erreur lors de la création de la créature :", err);

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
      <div className="min-h-screen bg-gold flex flex-col items-center">
        <CreateCreatureHeader title="Administration - Création de créature" />

        <CreateCreatureForm
          form={form}
          regions={regions}
          error={error}
          saving={saving}
          loadingRegions={loadingRegions}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </AuthGuard>
  );
}
