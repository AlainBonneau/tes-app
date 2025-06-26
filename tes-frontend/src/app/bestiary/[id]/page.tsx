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

  useEffect(() => {
    if (!id) return;
    async function fetchCreature() {
      try {
        const res = await api.get(`/creatures/${id}`);
        setCreature(res.data);
      } catch (error) {
        console.error("Erreur de chargement de la créature :", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    }
    fetchCreature();
  }, [id, router]);

  if (loading) return <Loader text="Chargement de la créature..." />;
  if (!creature) return null;

  return (
    <div className="min-h-screen bg-gold text-dark font-serif px-4 py-8">
      <div className="max-w-2xl mx-auto bg-parchment rounded-2xl shadow-lg p-8 border-2 border-gold">
        <h1 className="text-3xl font-bold text-center mb-6 font-uncial text-blood">
          {creature.name}
        </h1>
        <div className="flex flex-col items-center">
          {creature.imageUrl && (
            <Image
              width={320}
              height={256}
              src={creature.imageUrl}
              alt={creature.name}
              className="w-80 h-64 object-cover rounded-lg border mb-4"
            />
          )}
          <p className="mb-4 text-center text-lg">{creature.description}</p>
          <div className="w-full flex flex-col md:flex-row justify-between gap-4">
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
      </div>
    </div>
  );
}
