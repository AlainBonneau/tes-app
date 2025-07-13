"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import api from "@/app/api/axiosConfig";
import EditCreatureModal from "./EditCreatureModal";
import BestiaryPagination from "./BestiaryPagination";
import MyButton from "@/app/components/MyButton";
import Loader from "@/app/components/Loader";
import type { Creature } from "@/app/types/creatures";
import type { Region } from "@/app/types/creatures";

export default function AdminBestiaryPage() {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Creature>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  // Charger les créatures et les régions au chargement de la page
  useEffect(() => {
    async function fetchRegions() {
      try {
        const res = await api.get("/regions");
        setRegions(res.data);
      } catch (err) {
        console.error("Erreur de chargement des régions :", err);
        alert("Erreur lors du chargement des régions");
      }
    }
    fetchRegions();

    async function fetchCreatures() {
      try {
        setLoading(true);
        const res = await api.get("/creatures", { withCredentials: true });
        setCreatures(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des créatures :", error);
        alert("Erreur lors du chargement des créatures");
      } finally {
        setLoading(false);
      }
    }
    fetchCreatures();
  }, [saving]);

  // Réinitialiser la page à 1 lorsque la recherche change
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Fonction pour ouvrir le modal d'édition
  const openEditModal = (creature: Creature) => {
    setEditForm({ ...creature });
    setEditModalOpen(true);
  };

  // Fonction pour gérer les changements dans le formulaire d'édition
  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setEditForm((form) => ({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Fonction pour soumettre le formulaire d'édition
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
      setEditModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la créature :", err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  // Fonction pour filtrer les créatures par nom et pagination
  const filteredCreatures = creatures.filter((creature) =>
    creature.name.toLowerCase().includes(search.toLowerCase())
  );
  const pageSize = 9;
  const totalPages = Math.ceil(filteredCreatures.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCreatures = filteredCreatures.slice(startIndex, endIndex);

  // Fonction pour supprimer une créature
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette créature ?")) return;
    try {
      await api.delete(`/creatures/${id}`, {
        withCredentials: true,
      });
      setCreatures((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la créature :", error);
      alert("Erreur lors de la suppression de la créature");
    }
  };

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold text-dark pb-16">
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
            Administration - Bestiaire
          </h1>
        </div>

        <div className="max-w-6xl mx-auto  py-8 flex justify-center items-center">
          <MyButton
            label="Ajouter une créature"
            onClick={() => router.push("/admin/bestiary/create")}
          />
        </div>
        <div className="w-full">
          <div className="flex justify-end items-center p-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border border-sandstone bg-parchment text-blood rounded"
              placeholder="Rechercher une créature..."
            />
          </div>
        </div>

        {loading ? (
          <Loader text="Chargement des créatures..." />
        ) : (
          <>
            {/* Table PC/Tablet */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="min-w-full border border-gold shadow-lg rounded-xl bg-parchment">
                <thead className="bg-blood text-gold">
                  <tr>
                    <th className="py-2 px-3">Nom</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Région</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCreatures.map((creature) => (
                    <tr
                      key={creature.id}
                      className="border-t hover:bg-gold/20 transitionv text-center"
                    >
                      <td className="py-2 px-3 font-bold">{creature.name}</td>
                      <td className="py-2 px-3">{creature.type}</td>
                      <td className="py-2 px-3">
                        {creature.region?.name ?? "-"}
                      </td>
                      <td className="py-2 px-3 flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 bg-blood text-gold rounded hover:bg-blood/80 text-xs cursor-pointer"
                          onClick={() => openEditModal(creature)}
                        >
                          Éditer
                        </button>
                        <button
                          className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs cursor-pointer"
                          onClick={() => handleDelete(creature.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedCreatures.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-blood">
                        Aucun monstre trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cartes Mobile */}
            <div className="block sm:hidden space-y-4 mt-4 px-2">
              {paginatedCreatures.length === 0 && (
                <div className="text-center py-4 text-blood bg-parchment rounded-xl border border-gold">
                  Aucun monstre trouvé.
                </div>
              )}
              {paginatedCreatures.map((creature) => (
                <div
                  key={creature.id}
                  className="rounded-xl bg-parchment border border-gold p-4 shadow flex flex-col gap-2"
                >
                  <div>
                    <span className="font-bold text-blood">ID:</span>{" "}
                    {creature.id}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Nom:</span>{" "}
                    {creature.name}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Type:</span>{" "}
                    {creature.type}
                  </div>
                  <div>
                    <span className="font-bold text-blood">Région:</span>{" "}
                    {creature.region?.name ?? "-"}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="flex-1 px-2 py-2 bg-blood text-gold rounded hover:bg-blood/80 text-xs"
                      onClick={() => openEditModal(creature)}
                    >
                      Éditer
                    </button>
                    <button
                      className="flex-1 px-2 py-2 bg-gold text-blood rounded hover:bg-gold/80 text-xs"
                      onClick={() => handleDelete(creature.id)}
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
        <BestiaryPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {/* Modal d'édition */}
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
