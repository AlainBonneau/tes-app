"use client";

import { useEffect, useState } from "react";
import { CategoryCard } from "./CategoryCard";
import api from "../api/axiosConfig";
import Loader from "../components/Loader";
import type { Category } from "../types/category";

export default function ForumHomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur de chargement des catégories :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gold font-serif text-[#3A2E1E]">
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Taverne
        </h1>
      </div>
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader />
          </div>
        ) : (
          categories.map((cat) => <CategoryCard key={cat.id} cat={cat} />)
        )}
      </div>
    </div>
  );
}
