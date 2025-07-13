"use client";
import { useState, useEffect } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import api from "@/app/api/axiosConfig";
import { useRouter } from "next/navigation";
import type { Region } from "@/app/types/creatures";

export default function CreateCreaturePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    regionId: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [regions, setRegions] = useState<Region[]>([]);

  // Charger les régions pour le select
  useEffect(() => {
    async function fetchRegions() {
      try {
        const res = await api.get("/regions");
        setRegions(res.data);
      } catch (err) {
        console.error("Erreur de chargement des régions :", err);
        setError("Erreur lors du chargement des régions");
      }
    }
    fetchRegions();
  }, []);

  // Gérer les changements du formulaire
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Gérer la soumission du formulaire
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        regionId: form.regionId ? Number(form.regionId) : undefined,
      };
      const response = await api.post("/creatures", payload, {
        withCredentials: true,
      });
      if (response.status === 201) {
        router.push("/admin/bestiary");
      } else {
        setError("Une erreur inconnue est survenue.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError(err.response?.data?.error || "Erreur lors de la création");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold flex flex-col items-center">
        {/* Header */}
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-10">
          <h1 className="text-2xl md:text-4xl font-uncial uppercase text-gold text-center">
            Administration - Création de créature
          </h1>
        </div>
        <div className="w-full  flex flex-col items-center">
          {/* Formulaire */}
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
            onSubmit={handleSubmit}
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nom *"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              required
            />
            <input
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Type *"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description *"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              rows={3}
              required
            />
            <select
              name="regionId"
              value={form.regionId}
              onChange={handleChange}
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
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
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
          "
              disabled={saving}
            >
              {saving ? "Création..." : "Créer"}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
