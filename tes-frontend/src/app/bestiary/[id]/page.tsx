"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/app/api/axiosConfig";
import Loader from "@/app/components/Loader";
import type { Creature } from "@/app/types/creatures";

export default function CreatureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [creature, setCreature] = useState<Creature | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    async function fetchCreature() {
      try {
        const res = await api.get(`/creatures/${id}`);
        setCreature(res.data);
      } catch (error) {
        console.error("Erreur de chargement de la créature :", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCreature();
  }, [id]);

  // Gestion navigation entre monstres
  async function handleChangeCreature(nextId: number) {
    if (nextId <= 0) return;
    setLoading(true);
    setNotFound(false);
    try {
      const res = await api.get(`/creatures/${nextId}`);
      setCreature(res.data);
      router.replace(`/bestiary/${nextId}`);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gold text-dark font-serif">
      <div className="bg-blood h-[16vh] sm:h-[18vh] md:h-[20vh] w-full flex items-center justify-center mb-4 sm:mb-8 px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-uncial uppercase text-gold text-center break-words">
          Bestiaire {creature?.name ? `- ${creature.name}` : ""}
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[60vh] px-2">
        <div className="w-full max-w-2xl bg-parchment rounded-2xl shadow-lg p-4 sm:p-8 border-2 border-blood">
          {/* Loader */}
          {loading && <Loader text="Chargement de la créature..." />}

          {/* Monstre inexistant */}
          {notFound && (
            <div className="text-center text-xl font-uncial text-blood py-8">
              Monstre inexistant.
              <div className="mt-4">
                <button
                  onClick={() => router.push("/bestiary")}
                  className="px-6 py-2 bg-blood text-gold font-bold rounded-lg hover:bg-blood/80 transition-colors cursor-pointer"
                >
                  Retour au Bestiaire
                </button>
              </div>
            </div>
          )}

          {/* Affichage créature */}
          {!loading && !notFound && creature && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 font-uncial text-blood">
                {creature.name}
              </h2>
              <div className="flex flex-col items-center">
                {creature.imageUrl && (
                  <div className="w-full flex justify-center mb-4">
                    <Image
                      width={320}
                      height={256}
                      src={creature.imageUrl}
                      alt={creature.name}
                      className="w-64 h-48 sm:w-80 sm:h-64 object-cover rounded-lg border"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                )}
                <p className="mb-4 text-center text-base sm:text-lg">
                  {creature.description}
                </p>
                <div className="w-full flex flex-col md:flex-row justify-between gap-4 text-sm sm:text-base">
                  <div>
                    <span className="font-bold text-gold">Type : </span>
                    {creature.type}
                  </div>
                  <div>
                    <span className="font-bold text-gold">Région : </span>
                    {creature.region?.name ?? "Inconnue"}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Boutons de navigation */}
        {!loading && !notFound && creature && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 m-8 w-full max-w-2xl">
            <button
              className="flex-1 min-w-[140px] px-4 py-2 bg-blood text-gold font-bold rounded-lg hover:bg-blood/80 transition-colors cursor-pointer"
              onClick={() => handleChangeCreature(parseInt(id as string) - 1)}
              disabled={parseInt(id as string, 10) <= 1}
            >
              Monstre précédent
            </button>
            <button
              onClick={() => router.push("/bestiary")}
              className="flex-1 min-w-[140px] px-4 py-2 bg-blood text-gold font-bold rounded-lg hover:bg-blood/80 transition-colors cursor-pointer"
            >
              Retour au Bestiaire
            </button>
            <button
              className="flex-1 min-w-[140px] px-4 py-2 bg-blood text-gold font-bold rounded-lg hover:bg-blood/80 transition-colors cursor-pointer"
              onClick={() => handleChangeCreature(parseInt(id as string) + 1)}
            >
              Monstre suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
