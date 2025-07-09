"use client";
import { useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import api from "@/app/api/axiosConfig";
import { useRouter } from "next/navigation";

export default function CreateRegionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    x: "",
    y: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        router.push("/admin/map");
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
      <div className="min-h-screen bg-parchment flex flex-col items-center">
        {/* Header */}
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-10">
          <h1 className="text-2xl md:text-4xl font-uncial uppercase text-gold text-center">
            Administration – Création d’une région
          </h1>
        </div>
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
            onSubmit={handleSubmit}
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nom de la région *"
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
            <div className="flex flex-col md:flex-row gap-4">
              <input
                name="x"
                type="number"
                value={form.x}
                onChange={handleChange}
                placeholder="Coordonnée X (optionnel)"
                className="flex-1 p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              />
              <input
                name="y"
                type="number"
                value={form.y}
                onChange={handleChange}
                placeholder="Coordonnée Y (optionnel)"
                className="flex-1 p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              />
            </div>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Lien image (optionnel)"
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
              {saving ? "Création..." : "Créer la région"}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
