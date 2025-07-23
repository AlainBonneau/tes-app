"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/app/api/axiosConfig";
import Loader from "@/app/components/Loader";
import { useToast } from "@/app/context/ToastContext";
import { RootState } from "@/app/store";
import type { Category } from "@/app/types/category";
import type { Post } from "@/app/types/post";

export default function NewTopicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCategory = searchParams?.get("category") ?? "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categorySlug, setCategorySlug] = useState(defaultCategory);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    // Récupère les catégories
    async function fetchCategories() {
      setLoadingCategories(true);
      try {
        const res = await api.get<Category[]>("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories", err);
        alert("Erreur lors du chargement des catégories");
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  // Si aucune catégorie n'est sélectionnée, utilise la première
  useEffect(() => {
    if (!categorySlug && categories.length > 0) {
      setCategorySlug(categories[0].slug ?? "");
    }
  }, [categories, categorySlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const catObj = categories.find((c) => c.slug === categorySlug);
      if (!catObj) throw new Error("Catégorie invalide");
      const payload = {
        title,
        content,
        categoryId: catObj.id,
      };
      const res = await api.post<Post>("/posts", payload, {
        withCredentials: true,
      });
      router.push(`/tavern/post/${res.data.slug || res.data.id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        err.response?.data?.error ||
          "Une erreur est survenue lors de la création du sujet. Veuillez réessayer plus tard.",
        "error"
      );
      setError(
        err.response?.data?.error ||
          "Une erreur est survenue lors de la création du sujet. Veuillez réessayer plus tard."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Si l'utilisateur n'est pas connecté, affiche un message
  if (!isAuthenticated)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gold font-serif">
        <div className="bg-parchment border-2 border-blood shadow rounded-xl px-8 py-12 text-center">
          <div className="font-uncial text-blood text-2xl mb-2">
            Connexion requise
          </div>
          <div className="text-blood mb-4">
            Veuillez vous connecter pour créer un sujet.
          </div>
          <button
            className="bg-gold border border-blood rounded-lg px-5 py-2 text-blood font-bold hover:bg-blood hover:text-gold transition"
            onClick={() => router.push("/login")}
          >
            Se connecter
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gold flex flex-col items-center font-serif text-[#3A2E1E]">
      <div className="bg-blood h-[18vh] w-full flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Nouveau sujet
        </h1>
      </div>
      <div className="w-full max-w-2xl mx-auto px-3">
        <form
          onSubmit={handleSubmit}
          className="bg-parchment border-2 border-[#523211] rounded-2xl shadow-xl px-6 py-8 flex flex-col gap-6"
        >
          {/* Erreur */}
          {error && (
            <div className="text-red-700 bg-red-100 border border-red-300 rounded px-4 py-2 font-semibold">
              {error}
            </div>
          )}

          {/* Catégorie */}
          <div>
            <label className="font-bold mb-1 block">Catégorie</label>
            {loadingCategories ? (
              <Loader />
            ) : (
              <select
                className="border border-gold rounded px-3 py-2 w-full bg-parchment text-blood font-semibold"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* Titre */}
          <div>
            <label className="font-bold mb-1 block">Titre</label>
            <input
              className="border border-gold rounded px-3 py-2 w-full bg-parchment text-blood font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength={3}
              maxLength={128}
              required
              placeholder="Donnez un titre explicite à votre sujet"
              autoFocus
            />
          </div>
          {/* Contenu */}
          <div>
            <label className="font-bold mb-1 block">Message</label>
            <textarea
              className="border border-gold rounded px-3 py-2 w-full bg-parchment text-blood font-normal min-h-[120px] resize-vertical"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minLength={10}
              maxLength={4000}
              required
              placeholder="Votre message..."
            />
          </div>
          {/* Bouton */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blood text-gold font-bold px-8 py-2 rounded-xl border border-gold shadow hover:bg-blood/90 hover:scale-105 transition"
            >
              {submitting ? "Création..." : "Publier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
