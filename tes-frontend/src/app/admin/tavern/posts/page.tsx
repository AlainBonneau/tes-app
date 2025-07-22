"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import AuthGuard from "@/app/components/AuthGuard";
import api from "@/app/api/axiosConfig";
import EditPostModal from "./EditPostModal";
import PostsPagination from "./PostsPagination";
import MyButton from "@/app/components/MyButton";
import Loader from "@/app/components/Loader";
import type { Post } from "@/app/types/post";
import type { Category } from "@/app/types/category";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Post>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [isCommentary, setIsCommentary] = useState<boolean>(false);
  const { showToast } = useToast();
  const router = useRouter();

  // Charge les catégories et les posts au chargement
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Erreur chargement catégories :", err);
        showToast("Erreur lors du chargement des catégories", "error");
      }
    }
    fetchCategories();

    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await api.get("/posts?admin=1");
        setPosts(res.data);
      } catch (error) {
        console.error("Erreur chargement posts :", error);
        showToast("Erreur lors du chargement des posts", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [saving, showToast]);

  useEffect(() => setPage(1), [search]);

  // Ouvre la modale
  const openEditModal = (post: Post) => {
    setEditForm({ ...post, categoryId: post.category?.id });
    setEditModalOpen(true);
  };

  // Changement du form d'édition
  function handleEditChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setEditForm((form) => ({
      ...form,
      [name]: value,
    }));
  }

  // Soumission du form d'édition
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSend = {
        ...editForm,
        categoryId: editForm.categoryId ? Number(editForm.categoryId) : null,
      };
      await api.patch(`/posts/${editForm.id}`, dataToSend);
      showToast("Post édité avec succès", "success");
      setEditModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'édition du post :", err);
      showToast("Erreur lors de la modification", "error");
    } finally {
      setSaving(false);
    }
  };

  // Suppression d'un post
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce post ?")) return;
    setSaving(true);
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setIsCommentary(false);
      showToast("Post supprimé", "success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erreur lors de la suppression du post :", err);
      setIsCommentary(true);
      showToast(
        err.response?.data?.error || "Erreur lors de la suppression",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Pagination/recherche
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );
  const pageSize = 10;
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold text-dark pb-16">
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
            Administration - Posts du forum
          </h1>
        </div>
        <div className="max-w-6xl mx-auto py-8 flex justify-center items-center">
          <MyButton
            label="Créer un post"
            onClick={() => router.push("/admin/tavern/posts/create")}
          />
        </div>
        <div className="w-full flex justify-end items-center p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-sandstone bg-parchment text-blood rounded"
            placeholder="Rechercher un post..."
          />
        </div>

        {loading ? (
          <Loader text="Chargement des posts..." />
        ) : (
          <>
            {/* Table PC/Tablet */}
            <div className="hidden sm:block w-full overflow-x-auto">
              {isCommentary && (
                <div className="text-center">
                  <span className="ml-4 text-red-600">
                    Impossible de supprimer le post car il possède des
                    commentaires.
                  </span>
                </div>
              )}
              <table className="min-w-full border border-gold shadow-lg rounded-xl bg-parchment">
                <thead className="bg-blood text-gold">
                  <tr>
                    <th className="py-2 px-3">Titre</th>
                    <th className="py-2 px-3">Catégorie</th>
                    <th className="py-2 px-3">Auteur</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-t hover:bg-gold/20 transition text-center"
                    >
                      <td className="py-2 px-3 font-bold">{post.title}</td>
                      <td className="py-2 px-3">
                        {post.category?.name ?? "-"}
                      </td>
                      <td className="py-2 px-3">
                        {post.author?.username ?? "-"}
                      </td>
                      <td className="py-2 px-3">
                        {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-2 px-3 flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 bg-blood text-gold rounded hover:bg-blood/80 text-xs cursor-pointer"
                          onClick={() => openEditModal(post)}
                        >
                          Éditer
                        </button>
                        <button
                          className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
                          onClick={() => handleDelete(post.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedPosts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-blood">
                        Aucun post trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Cartes Mobile */}
            <div className="block sm:hidden space-y-4 mt-4 px-2">
              {paginatedPosts.length === 0 && (
                <div className="text-center py-4 text-blood bg-parchment rounded-xl border border-gold">
                  Aucun post trouvé.
                </div>
              )}
              {paginatedPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl bg-parchment border border-gold p-4 shadow flex flex-col gap-2"
                >
                  <div>
                    <span className="font-bold text-blood">Titre:</span>{" "}
                    {post.title}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Catégorie:</span>{" "}
                    {post.category?.name ?? "-"}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Auteur:</span>{" "}
                    {post.author?.username ?? "-"}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Date:</span>{" "}
                    {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="flex-1 px-2 py-2 bg-blood text-gold rounded hover:bg-blood/80 text-xs"
                      onClick={() => openEditModal(post)}
                    >
                      Éditer
                    </button>
                    <button
                      className="flex-1 px-2 py-2 bg-gold text-blood rounded hover:bg-gold/80 text-xs"
                      onClick={() => handleDelete(post.id)}
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
        <PostsPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {/* Modal d'édition */}
        {editModalOpen && (
          <EditPostModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            form={editForm}
            onChange={handleEditChange}
            onSubmit={handleEditSubmit}
            saving={saving}
            categories={categories}
          />
        )}
      </div>
    </AuthGuard>
  );
}
