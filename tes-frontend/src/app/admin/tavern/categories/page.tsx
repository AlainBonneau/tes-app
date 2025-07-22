"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import EditCategoryModal from "./EditCategoryModal";
import CategoriesPagination from "./CategoriesPagination";
import api from "@/app/api/axiosConfig";
import Loader from "@/app/components/Loader";
import MyButton from "@/app/components/MyButton";
import type { Category } from "@/app/types/category";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  // Pagination
  const pageSize = 10;
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Charge les catégories
  useEffect(() => {
    setLoading(true);
    async function fetchCategories() {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des catégories :", err);
        showToast("Erreur lors de la récupération des catégories", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [saving, showToast]);

  // Reset la pagination quand la recherche change
  useEffect(() => setPage(1), [search]);

  // Ouvre le modal d'édition ou de création
  const openEditModal = (cat?: Category) => {
    if (cat) setEditForm({ ...cat });
    else setEditForm({});
    setEditModalOpen(true);
  };

  // Gère les changements dans le formulaire d'édition
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  // Soumet le formulaire d'édition
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editForm.id) {
        await api.patch(`/categories/${editForm.id}`, { name: editForm.name });
        showToast("Catégorie modifiée", "success");
      } else {
        await api.post("/categories", { name: editForm.name });
        showToast("Catégorie créée", "success");
      }
      setEditModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      showToast("Erreur lors de l’enregistrement", "error");
    } finally {
      setSaving(false);
    }
  };

  // Supprime une catégorie
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    setSaving(true);
    try {
      await api.delete(`/categories/${id}`);
      console.log("Catégorie supprimée :", id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Catégorie supprimée", "success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erreur lors de la suppression :", err);
      showToast(
        err.response.data?.error || "Erreur lors de la suppression",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold text-dark pb-16">
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
            Administration – Catégories
          </h1>
        </div>
        <div className="max-w-6xl mx-auto  py-8 flex justify-center items-center">
          <MyButton
            label="Ajouter une catégorie"
            onClick={() => router.push("/admin/tavern/categories/create")}
          />
        </div>
        <div className="w-full">
          <div className="flex justify-end items-center p-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border border-sandstone bg-parchment text-blood rounded"
              placeholder="Rechercher une catégorie…"
            />
          </div>
        </div>
        {loading ? (
          <Loader text="Chargement des catégories…" />
        ) : (
          <>
            {/* Table PC/Tablet */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="min-w-full border border-gold shadow-lg rounded-xl bg-parchment">
                <thead className="bg-blood text-gold">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Nom</th>
                    <th className="py-2 px-3">Slug</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-t text-center hover:bg-gold/20"
                    >
                      <td className="py-2 px-3">{cat.id}</td>
                      <td className="py-2 px-3 font-bold">{cat.name}</td>
                      <td className="py-2 px-3">{cat.slug}</td>
                      <td className="py-2 px-3 flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 bg-blood text-gold rounded hover:bg-blood/80 text-xs"
                          onClick={() => openEditModal(cat)}
                        >
                          Éditer
                        </button>
                        <button
                          className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs"
                          onClick={() => handleDelete(cat.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedCategories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-blood">
                        Aucune catégorie trouvée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile Cards */}
            <div className="block sm:hidden space-y-4 mt-4 px-2">
              {paginatedCategories.length === 0 && (
                <div className="text-center py-4 text-blood bg-parchment rounded-xl border border-gold">
                  Aucune catégorie trouvée.
                </div>
              )}
              {paginatedCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-xl bg-parchment border border-gold p-4 shadow flex flex-col gap-2"
                >
                  <div>
                    <span className="font-bold text-blood">ID:</span> {cat.id}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Nom:</span>{" "}
                    {cat.name}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Slug:</span>{" "}
                    {cat.slug}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="flex-1 px-2 py-2 bg-blood text-gold rounded hover:bg-blood/80 text-xs"
                      onClick={() => openEditModal(cat)}
                    >
                      Éditer
                    </button>
                    <button
                      className="flex-1 px-2 py-2 bg-gold text-blood rounded hover:bg-gold/80 text-xs"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        <CategoriesPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {/* Modal d'édition/ajout */}
        {editModalOpen && (
          <EditCategoryModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            form={editForm}
            onChange={handleEditChange}
            onSubmit={handleEditSubmit}
            saving={saving}
          />
        )}
      </div>
    </AuthGuard>
  );
}
