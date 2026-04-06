"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import AuthGuard from "@/app/components/AuthGuard";
import { useServices } from "@/app/context/ServicesContext";
import type { Region } from "@/app/types/region";
import Loader from "@/app/components/Loader";
import EditRegionModal from "./components/EditRegionModal";
import RegionPagination from "./components/RegionPagination";
import AdminRegionsHeader from "./components/AdminRegionsHeader";
import AdminRegionsToolbar from "./components/AdminRegionsToolbar";
import RegionsTable from "./components/RegionsTable";
import RegionsMobileList from "./components/RegionsMobileList";

export default function AdminRegionsPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Region>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();
  const { mapService } = useServices();

  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(true);

      try {
        const regions = await mapService.listRegions<Region[]>();
        setRegions(regions);
      } catch (err) {
        console.error("Erreur lors du chargement des régions :", err);

        const message = axios.isAxiosError(err)
          ? err.response?.data?.error || "Erreur lors du chargement des régions"
          : "Erreur lors du chargement des régions";

        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, [showToast, saving, mapService]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const openEditModal = (region: Region) => {
    setEditForm(region);
    setEditModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      await mapService.updateRegion(Number(editForm.id), editForm);
      showToast("Région mise à jour avec succès", "success");
      setEditModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);

      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          "Erreur lors de la mise à jour de la région"
        : "Erreur lors de la mise à jour de la région";

      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Supprimer cette région ?");

    if (!confirmed) return;

    try {
      await mapService.deleteRegion(id);
      setRegions((prevRegions) =>
        prevRegions.filter((region) => region.id !== id),
      );
      showToast("Région supprimée avec succès", "success");
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);

      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          "Erreur lors de la suppression de la région"
        : "Erreur lors de la suppression de la région";

      showToast(message, "error");
    }
  };

  const filteredRegions = useMemo(() => {
    return regions.filter((region) =>
      region.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [regions, search]);

  const pageSize = 9;
  const totalPages = Math.ceil(filteredRegions.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedRegions = filteredRegions.slice(
    startIndex,
    startIndex + pageSize,
  );

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold text-dark pb-16">
        <AdminRegionsHeader title="Administration - Régions" />

        <AdminRegionsToolbar
          search={search}
          onSearchChange={setSearch}
          onCreate={() => router.push("/admin/map/create")}
        />

        {loading ? (
          <Loader text="Chargement des régions..." />
        ) : (
          <>
            <RegionsTable
              regions={paginatedRegions}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />

            <RegionsMobileList
              regions={paginatedRegions}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          </>
        )}

        <RegionPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {editModalOpen && (
          <EditRegionModal
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
