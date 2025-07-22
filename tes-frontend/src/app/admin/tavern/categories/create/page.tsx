"use client";
import { useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import { useToast } from "@/app/context/ToastContext";
import api from "@/app/api/axiosConfig";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    desc: "",
    icon: "",
    slug: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  // Gérer les changements du formulaire
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      if (!form.name.trim() || !form.slug.trim()) {
        setError("Veuillez remplir tous les champs requis.");
        setSaving(false);
        return;
      }
      const payload = {
        ...form,
        icon: form.icon || undefined,
        desc: form.desc || undefined,
      };
      const response = await api.post("/categories", payload, {
        withCredentials: true,
      });
      if (response.status === 201) {
        router.push("/admin/categories");
        showToast("Catégorie créée avec succès !", "success");
      } else {
        setError("Une erreur inconnue est survenue.");
        showToast("Erreur lors de la création", "error");
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("409")) {
        setError("Une catégorie avec ce nom ou ce slug existe déjà.");
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
            Administration – Création de catégorie
          </h1>
        </div>
        <div className="w-full flex flex-col items-center">
          {/* Formulaire */}
          <form
            className="
            w-full max-w-2xl
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
              placeholder="Nom de la catégorie *"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              required
              minLength={2}
            />
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="Slug unique (ex : general, aide...) *"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              required
              minLength={2}
              pattern="^[a-z0-9\-]+$"
              title="Utilisez seulement des lettres minuscules, chiffres ou tirets"
            />
            <input
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="Icône (optionnel : emoji, URL, nom d’icône...)"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
            />
            <textarea
              name="desc"
              value={form.desc}
              onChange={handleChange}
              placeholder="Description (optionnelle)"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              rows={3}
            />
            {error && (
              <div className="text-red-600 text-center mb-2 font-semibold bg-parchment/80 rounded-lg py-2">
                {error}
              </div>
            )}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                className="
                  bg-blood
                  text-gold
                  px-4 py-3
                  rounded-xl
                  font-bold
                  text-lg
                  shadow-lg
                  hover:bg-blood/90
                  hover:scale-105
                  transition
                  tracking-widest
                  cursor-pointer
                "
                onClick={() => router.push("/admin/categories")}
                disabled={saving}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="
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
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
