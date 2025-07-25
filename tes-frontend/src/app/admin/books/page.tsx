"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import AuthGuard from "@/app/components/AuthGuard";
import Loader from "@/app/components/Loader";
import api from "@/app/api/axiosConfig";
import EditBookModal from "./EditBookModal";
import type { Book } from "@/app/types/book";
import Image from "next/image";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Book>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const router = useRouter();

  // Charge les livres depuis l'API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books", { withCredentials: true });
      setBooks(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des livres :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // Filtre les livres selon la recherche
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const query = search.trim().toLowerCase();
      return (
        book.title.toLowerCase().includes(query) ||
        (book.author?.toLowerCase() || "").includes(query) ||
        (book.summary?.toLowerCase() || "").includes(query)
      );
    });
  }, [books, search]);

  // Pagination
  const pageSize = 9;
  const totalPages = Math.ceil(filteredBooks.length / pageSize);
  const paginatedBooks = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, page, pageSize]);

  // Ouvre le modal pour édition ou création de livre
  const handleEditBook = (book: Book) => {
    setEditForm(book);
    setEditModalOpen(true);
  };

  // Gère les changements dans le formulaire d'édition
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  // Soumet le formulaire d'édition
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editForm.id) {
        await api.patch(`/books/${editForm.id}`, editForm, {
          withCredentials: true,
        });
        showToast("Livre mis à jour avec succès !");
      }
      setEditModalOpen(false);
      setEditForm({});
      await fetchBooks();
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la mise à jour du livre.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Supprime un livre
  const handleDeleteBook = async (id: number) => {
    if (!confirm("Supprimer ce livre ?")) return;
    try {
      await api.delete(`/books/${id}`, { withCredentials: true });
      showToast("Livre supprimé avec succès !");
      await fetchBooks();
    } catch (err) {
      alert("Erreur lors de la suppression.");
      console.error(err);
      showToast("Erreur lors de la suppression du livre.", "error");
    }
  };

  // Prévisualise le contenu du livre
  function previewContent(content?: string, wordLimit = 12) {
    if (!content) return "";
    const words = content.split(/\s+/);
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(" ") + "…";
  }

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold font-serif text-[#3A2E1E]">
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
            Administration – Livres
          </h1>
        </div>

        {/* En-tête et barre de recherche */}
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto mb-8 gap-3 px-2">
          <button
            className="bg-blood text-gold px-4 py-2 rounded font-cinzel border border-gold hover:bg-blood/90 transition font-bold shadow cursor-pointer"
            onClick={() => router.push("/admin/books/create")}
          >
            Ajouter un livre
          </button>
          <input
            type="text"
            placeholder="Recherche (titre, auteur, résumé...)"
            className="px-4 py-2 rounded border border-gold bg-parchment text-blood w-full md:w-64 shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Résultat */}
        <div className="text-center text-blood mb-4 font-cinzel">
          {filteredBooks.length > 0
            ? `${filteredBooks.length} résultat${
                filteredBooks.length > 1 ? "s" : ""
              }`
            : "Aucun livre trouvé"}
        </div>

        {/* Chargement */}
        {loading ? (
          <Loader text="Chargement des livres..." />
        ) : (
          <div>
            {/* Table responsive desktop */}
            <div className="hidden sm:block overflow-x-auto max-w-6xl mx-auto rounded-lg shadow">
              <table className="min-w-full border border-gold bg-parchment rounded-xl text-sm">
                <thead className="bg-blood text-gold">
                  <tr>
                    <th className="py-2 px-3">Image</th>
                    <th className="py-2 px-3">Titre</th>
                    <th className="py-2 px-3">Auteur</th>
                    <th className="py-2 px-3">Résumé</th>
                    <th className="py-2 px-3">Contenu</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book) => (
                    <tr
                      key={book.id}
                      className="border-t text-center hover:bg-gold/20 transition"
                    >
                      <td className="py-2 px-3">
                        <Image
                          src={book.imageUrl || "/assets/default-book.png"}
                          alt={book.title}
                          width={48}
                          height={60}
                          className="rounded border border-book object-contain w-12 h-16 mx-auto"
                        />
                      </td>
                      <td className="py-2 px-3 font-bold">{book.title}</td>
                      <td className="py-2 px-3 italic">{book.author || "?"}</td>
                      <td className="py-2 px-3 text-xs text-stone max-w-[200px] truncate">
                        {book.summary}
                      </td>
                      <td className="text-xs text-stone max-w-[200px] truncate">
                        {previewContent(book.content)}
                      </td>

                      <td className="py-2 px-3 flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
                          onClick={() => handleEditBook(book)}
                        >
                          Éditer
                        </button>
                        <button
                          className="px-3 py-1 bg-blood text-gold rounded hover:bg-blood/80 text-xs cursor-pointer"
                          onClick={() => handleDeleteBook(book.id!)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedBooks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-blood">
                        Aucun livre trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cartes responsive mobile */}
            <div className="block sm:hidden space-y-4 max-w-2xl w-full px-2 mx-auto mt-4">
              {paginatedBooks.length === 0 && (
                <div className="text-center text-blood font-bold mt-16 bg-parchment rounded-xl border border-gold py-8">
                  Aucun livre trouvé.
                </div>
              )}
              {paginatedBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex gap-4 p-4 bg-parchment rounded-xl border-2 border-book shadow"
                >
                  <Image
                    src={book.imageUrl || "/assets/default-book.png"}
                    alt={book.title}
                    width={56}
                    height={72}
                    className="rounded border border-book object-contain w-14 h-18 flex-shrink-0"
                  />
                  <div className="flex flex-col flex-1">
                    <div className="font-uncial text-base text-blood font-bold mb-1">
                      {book.title}
                    </div>
                    <div className="text-xs text-sandstone italic">
                      {book.author || "?"}
                    </div>
                    <div className="text-xs text-stone mt-1 line-clamp-4">
                      {book.summary}
                    </div>
                    <div className="text-xs text-stone mt-2">
                      {previewContent(book.content)}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs w-full"
                        onClick={() => handleEditBook(book)}
                      >
                        Éditer
                      </button>
                      <button
                        className="px-3 py-1 bg-blood text-gold rounded hover:bg-blood/80 text-xs w-full"
                        onClick={() => handleDeleteBook(book.id!)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-4 pt-8 pb-8">
          <button
            disabled={page === 1}
            className={`px-6 py-2 rounded font-cinzel bg-blood border text-gold border-gold hover:bg-gold/80 transition ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Précédent
          </button>
          <span className="font-bold">
            {page} / {totalPages || 1}
          </span>
          <button
            disabled={page === totalPages || totalPages === 0}
            className={`px-6 py-2 rounded font-cinzel bg-blood text-gold border border-gold hover:bg-gold/80 transition ${
              page === totalPages || totalPages === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            Suivant
          </button>
        </div>

        {/* Modal d'édition */}
        <EditBookModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          form={editForm}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          saving={saving}
        />
      </div>
    </AuthGuard>
  );
}
