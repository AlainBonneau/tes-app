"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import AuthGuard from "@/app/components/AuthGuard";
import api from "@/app/api/axiosConfig";
import type { Creature } from "@/app/types/creatures";
import MyButton from "@/app/components/MyButton";
import Loader from "@/app/components/Loader";

export default function AdminBestiaryPage() {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Creature>>({});
  const [saving, setSaving] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);
  const token = auth.token;

  const router = useRouter();

  // Charger les créatures au chargement de la page
  useEffect(() => {
    async function fetchCreatures() {
      try {
        setLoading(true);
        const res = await api.get("/creatures");
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

  // Fonction pour ouvrir le modal d'édition
  const openEditModal = (creature: Creature) => {
    setEditForm({ ...creature });
    setEditModalOpen(true);
  };

  // Fonction pour gérer les changements dans le formulaire d'édition
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditForm((form: Partial<Creature>) => ({
      ...form,
      [e.target.name]: e.target.value,
    }));
  };

  // Fonction pour soumettre le formulaire d'édition
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/creatures/${editForm.id}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setEditModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la créature :", err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  // Fonction pour supprimer une créature
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette créature ?")) return;
    try {
      await api.delete(`/creatures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

        {loading ? (
          <Loader text="Chargement des créatures..." />
        ) : (
          <>
            {/* Table PC/Tablet */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="min-w-full border border-gold shadow-lg rounded-xl bg-parchment">
                <thead className="bg-blood text-gold">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Nom</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Région</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creatures.map((creature) => (
                    <tr
                      key={creature.id}
                      className="border-t hover:bg-gold/20 transition"
                    >
                      <td className="py-2 px-3 text-center">{creature.id}</td>
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
                          className="px-3 py-1 bg-gold text-blood rounded hover:bg-gold/80 text-xs"
                          onClick={() => handleDelete(creature.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {creatures.length === 0 && (
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
              {creatures.length === 0 && (
                <div className="text-center py-4 text-blood bg-parchment rounded-xl border border-gold">
                  Aucun monstre trouvé.
                </div>
              )}
              {creatures.map((creature) => (
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
                    <button className="flex-1 px-2 py-2 bg-gold text-blood rounded hover:bg-gold/80 text-xs">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal d'édition */}
        {editModalOpen && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/60">
            <div className="bg-parchment border-2 border-blood p-8 rounded-xl shadow-xl w-full max-w-lg mx-4">
              <h2 className="text-xl font-bold text-blood mb-6">
                Modifier la créature
              </h2>
              <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Nom"
                  className="p-2 rounded border border-gold"
                  required
                />
                <input
                  name="type"
                  value={editForm.type}
                  onChange={handleEditChange}
                  placeholder="Type"
                  className="p-2 rounded border border-gold"
                  required
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Description"
                  className="p-2 rounded border border-gold"
                  rows={3}
                  required
                />
                <input
                  name="regionId"
                  value={editForm.regionId}
                  onChange={handleEditChange}
                  placeholder="ID de région"
                  className="p-2 rounded border border-gold"
                  type="number"
                />
                <input
                  name="imageUrl"
                  value={editForm.imageUrl || ""}
                  onChange={handleEditChange}
                  placeholder="Lien image"
                  className="p-2 rounded border border-gold"
                />
                <div className="flex gap-4 mt-4 justify-end">
                  <button
                    type="button"
                    className="bg-blood text-gold px-4 py-2 rounded hover:bg-blood/80"
                    onClick={() => setEditModalOpen(false)}
                    disabled={saving}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-gold text-blood px-4 py-2 rounded hover:bg-gold/80 font-bold"
                    disabled={saving}
                  >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
