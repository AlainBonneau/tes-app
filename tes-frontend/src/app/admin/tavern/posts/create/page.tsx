"use client";
import { useState, useEffect } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import { useToast } from "@/app/context/ToastContext";
import api from "@/app/api/axiosConfig";
import { useRouter } from "next/navigation";
import type { Category } from "@/app/types/category";

export default function CreatePostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: "",
    slug: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const { showToast } = useToast();

  // Charger les catégories pour le select
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories", err);
        setError("Erreur lors du chargement des catégories");
      }
    }
    fetchCategories();
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
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      };
      const response = await api.post("/posts", payload);
      if (response.status === 201) {
        router.push("/admin/tavern/posts");
        showToast("Sujet créé avec succès !", "success");
      } else {
        setError("Une erreur inconnue est survenue.");
        showToast("Erreur lors de la création", "error");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold flex flex-col items-center">
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-10">
          <h1 className="text-2xl md:text-4xl font-uncial uppercase text-gold text-center">
            Administration - Création de sujet
          </h1>
        </div>
        <div className="w-full flex flex-col items-center">
          <form
            className="w-full max-w-3xl bg-blood/95 mb-10 border-2 border-gold rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col gap-5 backdrop-blur-md"
            onSubmit={handleSubmit}
          >
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Titre *"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              required
            />
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Contenu *"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              rows={5}
              required
            />
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              required
            >
              <option value="">Sélectionner une catégorie *</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="Slug unique *"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              required
            />
            {error && (
              <div className="text-red-600 text-center mb-2 font-semibold bg-parchment/80 rounded-lg py-2">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="mt-4 bg-gold text-blood px-4 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-gold/90 hover:scale-105 transition tracking-widest cursor-pointer"
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
