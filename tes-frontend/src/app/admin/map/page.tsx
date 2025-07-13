"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import AuthGuard from "@/app/components/AuthGuard";
import Image from "next/image";
import api from "@/app/api/axiosConfig";
import type { Region } from "@/app/types/region";
import Loader from "@/app/components/Loader";
import MyButton from "@/app/components/MyButton";
import EditRegionModal from "./EditRegionModal";
import RegionPagination from "./RegionPagination";

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

  // Chargement des régions
  useEffect(() => {
    async function fetchRegions() {
      setLoading(true);
      try {
        const res = await api.get("/regions");
        setRegions(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des régions :", err);
        alert("Erreur lors du chargement des régions");
      } finally {
        setLoading(false);
      }
    }
    fetchRegions();
  }, [saving]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // Modal d'édition
  const openEditModal = (region: Region) => {
    setEditForm(region);
    setEditModalOpen(true);
  };

  // Gestion des changements dans le formulaire d'édition
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setEditForm((form) => ({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Soumission du formulaire d'édition
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/regions/${editForm.id}`, editForm);
      setEditModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  // Suppression d'une région
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette région ?")) return;
    try {
      await api.delete(`/regions/${id}`);
      setRegions((prev) => prev.filter((r) => r.id !== id));
      showToast("Région supprimée avec succès", "success");
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      showToast("Erreur lors de la suppression de la région", "error");
    }
  };

  // Filtrage et pagination des régions
  const filteredRegions = regions.filter((region) =>
    region.name.toLowerCase().includes(search.toLowerCase())
  );
  const pageSize = 9;
  const totalPages = Math.ceil(filteredRegions.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedRegions = filteredRegions.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold text-dark pb-16">
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
            Administration - Régions
          </h1>
        </div>

        {/* Bouton ajout + recherche */}
        <div className="max-w-6xl mx-auto py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <MyButton
            label="Ajouter une région"
            onClick={() => router.push("/admin/map/create")}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-sandstone bg-parchment text-blood rounded w-full md:w-64"
            placeholder="Rechercher une région..."
          />
        </div>

        {/* Affichage des régions */}
        {loading ? (
          <Loader text="Chargement des régions..." />
        ) : (
          <>
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="min-w-full border border-gold shadow-lg rounded-xl bg-parchment">
                <thead className="bg-blood text-gold">
                  <tr>
                    <th className="py-2 px-3">Nom</th>
                    <th className="py-2 px-3">X</th>
                    <th className="py-2 px-3">Y</th>
                    <th className="py-2 px-3">Image</th>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRegions.map((region) => (
                    <tr
                      key={region.id}
                      className="border-t text-center hover:bg-gold/20 transition"
                    >
                      <td className="py-2 px-3 font-bold">{region.name}</td>
                      <td className="py-2 px-3">{region.x}</td>
                      <td className="py-2 px-3">{region.y}</td>
                      <td className="py-2 px-3">
                        {region.imageUrl ? (
                          <Image
                            width={48}
                            height={48}
                            src={region.imageUrl}
                            alt=""
                            className="w-12 h-12 object-cover rounded border border-gold"
                          />
                        ) : (
                          <span className="text-gray-400 italic">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {region.description.slice(0, 60)}...
                      </td>
                      <td className="py-2 px-3 flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 bg-blood text-gold rounded hover:bg-blood/80 text-xs cursor-pointer"
                          onClick={() => openEditModal(region)}
                        >
                          Éditer
                        </button>
                        <button
                          className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
                          onClick={() => handleDelete(region.id!)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedRegions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-blood">
                        Aucune région trouvée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Affichage mobile */}
            <div className="block sm:hidden space-y-4 mt-4 px-2">
              {paginatedRegions.length === 0 && (
                <div className="text-center py-4 text-blood bg-parchment rounded-xl border border-gold">
                  Aucune région trouvée.
                </div>
              )}
              {paginatedRegions.map((region) => (
                <div
                  key={region.id}
                  className="rounded-xl bg-parchment border border-gold p-4 shadow flex flex-col gap-2"
                >
                  <div>
                    <span className="font-bold text-blood">Nom:</span>{" "}
                    {region.name}
                  </div>
                  <div>
                    <span className="font-bold text-blood">X:</span> {region.x}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Y:</span> {region.y}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Image:</span>{" "}
                    {region.imageUrl ? (
                      <Image
                        width={64}
                        height={64}
                        src={region.imageUrl}
                        alt=""
                        className="w-16 h-16 object-cover rounded border border-gold inline-block"
                      />
                    ) : (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Description:</span>{" "}
                    {region.description.slice(0, 60)}...
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="flex-1 px-2 py-2 bg-blood text-gold rounded hover:bg-blood/80 text-xs"
                      onClick={() => openEditModal(region)}
                    >
                      Éditer
                    </button>
                    <button
                      className="flex-1 px-2 py-2 bg-gold text-blood rounded hover:bg-gold/80 text-xs"
                      onClick={() => handleDelete(region.id!)}
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
        <RegionPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {/* Modal édition */}
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
