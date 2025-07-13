"use client";
import { useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import api from "@/app/api/axiosConfig";
import { useRouter } from "next/navigation";

export default function CreateBookPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    author: "",
    summary: "",
    imageUrl: "",
    content: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Gérer les changements du formulaire
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Soumission du formulaire
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await api.post("/books", form, {
        withCredentials: true,
      });
      if (response.status === 201) {
        router.push("/admin/books");
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
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-10">
          <h1 className="text-2xl md:text-4xl font-uncial uppercase text-gold text-center">
            Administration - Création de livre
          </h1>
        </div>
        <div className="w-full flex flex-col items-center">
          {/* Formulaire */}
          <form
            className=" w-full max-w-3xl bg-blood/95 mb-10 border-2 border-gold rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col gap-5 backdrop-blur-md "
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
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Auteur (optionnel)"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Lien image (optionnel)"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
            />
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              placeholder="Résumé (optionnel)"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              rows={3}
            />
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Contenu du livre *"
              className="p-3 rounded-xl border border-gold bg-parchment/90 focus:bg-parchment/100 focus:outline-none text-lg shadow transition"
              rows={12}
              required
            />
            {error && (
              <div className="text-red-600 text-center mb-2 font-semibold bg-parchment/80 rounded-lg py-2">
                {error}
              </div>
            )}
            <button
              type="submit"
              className=" mt-4 bg-gold text-blood px-4 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-gold/90 hover:scale-105 transition tracking-widest cursor-pointer "
              disabled={saving}
            >
              {saving ? "Création..." : "Créer le livre"}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
