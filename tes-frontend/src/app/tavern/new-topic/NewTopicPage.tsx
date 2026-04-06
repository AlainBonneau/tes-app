"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import { useServices } from "@/app/context/ServicesContext";
import { RootState } from "@/app/store";
import type { Category } from "@/app/types/category";
import type { Post } from "@/app/types/post";
import NewTopicHeader from "./components/NewTopicHeader";
import NewTopicAuthGate from "./components/NewTopicAuthGate";
import NewTopicForm from "./components/NewTopicForm";
import Loader from "@/app/components/Loader";

export default function NewTopicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { tavernService } = useServices();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const defaultCategory = searchParams.get("category") ?? "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categorySlug, setCategorySlug] = useState(defaultCategory);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);

      try {
        const categories = await tavernService.listCategories<Category[]>();
        setCategories(categories);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories :", err);
        showToast("Erreur lors du chargement des catégories.", "error");
      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [showToast, tavernService]);

  useEffect(() => {
    if (defaultCategory) {
      setCategorySlug(defaultCategory);
    }
  }, [defaultCategory]);

  useEffect(() => {
    if (!categorySlug && categories.length > 0) {
      setCategorySlug(categories[0].slug ?? "");
    }
  }, [categories, categorySlug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSubmitting(true);

    try {
      const selectedCategory = categories.find(
        (category) => category.slug === categorySlug,
      );

      if (!selectedCategory) {
        throw new Error("Catégorie invalide");
      }

      const payload = {
        title,
        content,
        categoryId: selectedCategory.id,
      };

      const createdPost = await tavernService.createPost<Post>(payload);
      router.push(`/tavern/post/${createdPost.slug || createdPost.id}`);
    } catch (err) {
      console.error("Erreur lors de la création du sujet :", err);

      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          "Une erreur est survenue lors de la création du sujet. Veuillez réessayer plus tard."
        : err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création du sujet. Veuillez réessayer plus tard.";

      setError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gold flex items-center justify-center">
        <Loader text="Chargement des catégories..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <NewTopicAuthGate onLogin={() => router.push("/login")} />;
  }

  return (
    <div className="min-h-screen bg-gold flex flex-col items-center font-serif text-[#3A2E1E]">
      <NewTopicHeader title="Nouveau sujet" />

      <NewTopicForm
        error={error}
        categories={categories}
        loadingCategories={loadingCategories}
        categorySlug={categorySlug}
        title={title}
        content={content}
        submitting={submitting}
        onCategoryChange={setCategorySlug}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
