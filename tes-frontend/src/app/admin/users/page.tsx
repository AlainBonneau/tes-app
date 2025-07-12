"use client";
import { useState, useEffect } from "react";
import api from "@/app/api/axiosConfig";
import Loader from "@/app/components/Loader";
import { User } from "@/app/types/user";
import EditUserModal from "./EditUserModal";
import { AnimatePresence } from "framer-motion";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [saving, setSaving] = useState(false);

  const pageSize = 10;
  const totalPages = Math.ceil(
    users.filter(
      (u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    ).length / pageSize
  );

  // Hook pour recharger les utilisateurs à chaque fois que la modale est fermée ou qu'un utilisateur est modifié
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs", err);
        alert("Erreur lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [saving]);

  // Filtrage et pagination
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const startIndex = (page - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // Modale édition
  const openEditModal = (user: User) => {
    setEditForm(user);
    setEditModalOpen(true);
  };

  // Gestion des changements dans le formulaire d'édition
  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((form) => ({
      ...form,
      [name]: name === "role" ? value : value,
    }));
  };

  // Soumission du formulaire d'édition
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/users/${editForm.id}`, editForm);
      setEditModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur", err);
      alert("Erreur lors de la mise à jour de l'utilisateur");
    } finally {
      setSaving(false);
    }
  };

  // Suppression d'un utilisateur
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    setSaving(true);
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  // Réinitialiser la page à 1 quand la recherche change
  useEffect(() => setPage(1), [search]);

  return (
    <div className="min-h-screen bg-gold text-dark pb-16">
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Administration - Utilisateurs
        </h1>
      </div>

      {/* Bouton ajout + recherche */}
      <div className="max-w-6xl mx-auto py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* (Ajout d'utilisateur ici si besoin) */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-sandstone bg-parchment text-blood rounded w-full md:w-64"
          placeholder="Rechercher un utilisateur…"
        />
      </div>

      {/* Table desktop */}
      {loading ? (
        <Loader text="Chargement des utilisateurs…" />
      ) : (
        <>
          <div className="hidden sm:block w-full overflow-x-auto">
            <table className="min-w-full border border-gold shadow-lg rounded-xl bg-parchment">
              <thead className="bg-blood text-gold">
                <tr>
                  <th className="py-2 px-3">Nom d&apos;utilisateur</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Rôle</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t text-center hover:bg-gold/20 transition"
                  >
                    <td className="py-2 px-3 font-bold">{user.username}</td>
                    <td className="py-2 px-3">{user.email}</td>
                    <td className="py-2 px-3">{user.role}</td>
                    <td className="py-2 px-3 flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 bg-blood text-gold rounded hover:bg-blood/80 text-xs"
                        onClick={() => openEditModal(user)}
                      >
                        Éditer
                      </button>
                      <button
                        className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs"
                        onClick={() => handleDelete(user.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-blood">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cartes mobile */}
          <div className="block sm:hidden space-y-4 mt-4 px-2">
            {paginatedUsers.length === 0 && (
              <div className="text-center py-4 text-blood bg-parchment rounded-xl border border-gold">
                Aucun utilisateur trouvé.
              </div>
            )}
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl bg-parchment border border-gold p-4 shadow flex flex-col gap-2"
              >
                <div>
                  <span className="font-bold text-blood">Nom :</span>{" "}
                  {user.username}
                </div>
                <div>
                  <span className="font-bold text-blood">Email :</span>{" "}
                  {user.email}
                </div>
                <div>
                  <span className="font-bold text-blood">Rôle :</span>{" "}
                  {user.role}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 px-2 py-2 bg-blood text-gold rounded hover:bg-blood/80 text-xs"
                    onClick={() => openEditModal(user)}
                  >
                    Éditer
                  </button>
                  <button
                    className="flex-1 px-2 py-2 bg-gold text-blood rounded hover:bg-gold/80 text-xs"
                    onClick={() => handleDelete(user.id)}
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
      <div className="flex justify-center gap-4 pt-8 pb-8">
        <button
          disabled={page === 1}
          className={`px-6 py-2 rounded font-cinzel bg-blood border text-gold border-gold hover:bg-blood/80 transition cursor-pointer ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setPage(page - 1)}
        >
          Précédent
        </button>
        <span className="font-bold">
          {page} / {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          className={`px-6 py-2 rounded font-cinzel bg-blood text-gold border border-gold hover:bg-blood/80 transition cursor-pointer  ${
            page === totalPages || totalPages === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={() => setPage(page + 1)}
        >
          Suivant
        </button>
      </div>

      {/* Modale d'édition */}
      <AnimatePresence>
        {editModalOpen && (
          <EditUserModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            form={editForm}
            onChange={handleEditChange}
            onSubmit={handleEditSubmit}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
