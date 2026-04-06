"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/app/context/ToastContext";
import api from "@/app/api/axiosConfig";
import Loader from "@/app/components/Loader";
import AuthGuard from "@/app/components/AuthGuard";
import EditUserModal from "./components/EditUserModal";
import AdminUsersHeader from "./components/AdminUsersHeader";
import AdminUsersToolbar from "./components/AdminUsersToolbar";
import UsersTable from "./components/UsersTable";
import UsersMobileList from "./components/UsersMobileList";
import UsersPagination from "./components/UsersPagination";
import type { User } from "@/app/types/user";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const pageSize = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const response = await api.get<User[]>("/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs", err);

        const message = axios.isAxiosError(err)
          ? err.response?.data?.error ||
            "Erreur lors du chargement des utilisateurs"
          : "Erreur lors du chargement des utilisateurs";

        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [saving, editModalOpen, showToast]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const openEditModal = (user: User) => {
    setEditForm(user);
    setEditModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/users/${editForm.id}`, editForm);
      showToast("Utilisateur mis à jour avec succès", "success");
      setEditModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur", err);

      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          "Erreur lors de la mise à jour de l'utilisateur"
        : "Erreur lors de la mise à jour de l'utilisateur";

      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllUserContent = async (id: number) => {
    const confirmed = window.confirm(
      "Supprimer TOUT le contenu de cet utilisateur ?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}/content`);
      showToast("Contenu supprimé !", "success");
    } catch (err) {
      console.error(
        "Erreur lors de la suppression du contenu de l'utilisateur",
        err,
      );

      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          "Erreur lors de la suppression du contenu."
        : "Erreur lors de la suppression du contenu.";

      showToast(message, "error");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Supprimer cet utilisateur ?");

    if (!confirmed) return;

    setSaving(true);

    try {
      await api.delete(`/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      showToast("Utilisateur supprimé avec succès", "success");
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur", err);

      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          "Erreur lors de la suppression de l'utilisateur"
        : "Erreur lors de la suppression de l'utilisateur";

      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold text-dark pb-16">
        <AdminUsersHeader title="Administration - Utilisateurs" />

        <AdminUsersToolbar search={search} onSearchChange={setSearch} />

        {loading ? (
          <Loader text="Chargement des utilisateurs…" />
        ) : (
          <>
            <UsersTable
              users={paginatedUsers}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onDeleteAllContent={handleDeleteAllUserContent}
            />

            <UsersMobileList
              users={paginatedUsers}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onDeleteAllContent={handleDeleteAllUserContent}
            />
          </>
        )}

        <UsersPagination
          page={page}
          totalPages={totalPages}
          onPrevious={() => setPage((prev) => prev - 1)}
          onNext={() => setPage((prev) => prev + 1)}
        />

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
    </AuthGuard>
  );
}
