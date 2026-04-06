"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import AuthGuard from "@/app/components/AuthGuard";
import api from "@/app/api/axiosConfig";
import EditCreatureModal from "./components/EditCreatureModal";
import BestiaryPagination from "./components/BestiaryPagination";
import AdminBestiaryHeader from "./components/AdminBestiaryHeader";
import AdminBestiaryToolbar from "./components/AdminBestiaryToolbar";
import CreaturesTable from "./components/CreaturesTable";
import CreaturesMobileList from "./components/CreatureMobileList";
import Loader from "@/app/components/Loader";
import type { Creature, Region } from "@/app/types/creatures";

export default function AdminBestiaryPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Creature>>({});

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);

      try {
        const [regionsResponse, creaturesResponse] = await Promise.all([
          api.get<Region[]>("/regions"),
          api.get<Creature[]>("/creatures", { withCredentials: true }),
        ]);

        setRegions(regionsResponse.data);
        setCreatures(creaturesResponse.data);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des données du bestiaire :",
          err,
        );

        const message = axios.isAxiosError(err)
          ? err.response?.data?.error ||
            "Erreur lors du chargement du bestiaire."
          : "Erreur lors du chargement du bestiaire.";

        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [showToast, saving]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const openEditModal = (creature: Creature) => {
    setEditForm({ ...creature });
    setEditModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSend = {
        ...editForm,
        regionId: editForm.regionId ? Number(editForm.regionId) : null,
      };

      await api.patch(`/creatures/${editForm.id}`, dataToSend, {
        withCredentials: true,
      });

      showToast("Créature mise à jour avec succès", "success");
      setEditModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la créature :", err);

      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          "Erreur lors de la mise à jour de la créature."
        : "Erreur lors de la mise à jour de la créature.";

      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette créature ?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/creatures/${id}`, {
        withCredentials: true,
      });

      setCreatures((prevCreatures) =>
        prevCreatures.filter((creature) => creature.id !== id),
      );

      showToast("Créature supprimée avec succès", "success");
    } catch (err) {
      console.error("Erreur lors de la suppression de la créature :", err);

      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          "Erreur lors de la suppression de la créature."
        : "Erreur lors de la suppression de la créature.";

      showToast(message, "error");
    }
  };

  const filteredCreatures = useMemo(() => {
    return creatures.filter((creature) =>
      creature.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [creatures, search]);

  const pageSize = 9;
  const totalPages = Math.ceil(filteredCreatures.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedCreatures = filteredCreatures.slice(
    startIndex,
    startIndex + pageSize,
  );

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold text-dark pb-16">
        <AdminBestiaryHeader title="Administration - Bestiaire" />

        <AdminBestiaryToolbar
          search={search}
          onSearchChange={setSearch}
          onCreate={() => router.push("/admin/bestiary/create")}
        />

        {loading ? (
          <Loader text="Chargement des créatures..." />
        ) : (
          <>
            <CreaturesTable
              creatures={paginatedCreatures}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />

            <CreaturesMobileList
              creatures={paginatedCreatures}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          </>
        )}

        <BestiaryPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {editModalOpen && (
          <EditCreatureModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            form={editForm}
            onChange={handleEditChange}
            onSubmit={handleEditSubmit}
            saving={saving}
            regions={regions}
          />
        )}
      </div>
    </AuthGuard>
  );
}
