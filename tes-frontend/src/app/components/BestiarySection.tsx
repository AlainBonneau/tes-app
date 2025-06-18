// src/app/components/Bestiary.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CreatureCard from "./CreatureCard";
import { Creature } from "../types/creatures";
import api from "../api/axiosConfig";

export default function BestiarySection() {
  const [creatures, setCreatures] = useState<Creature[]>([]);

  useEffect(() => {
    (async function loadCreatures() {
      try {
        const { data } = await api.get<Creature[]>("/creatures");
        const fourRandomIndices = new Set<number>();
        while (fourRandomIndices.size < 4) {
          const randomIndex = Math.floor(Math.random() * data.length);
          fourRandomIndices.add(randomIndex);
        }
        const fourCreatures = Array.from(fourRandomIndices).map(
          (index) => data[index]
        );
        setCreatures(fourCreatures);
      } catch (err) {
        console.error("Erreur fetch creatures:", err);
      }
    })();
  }, []);

  return (
    <section className="h-screen w-full bg-dark">
      <div className="bestiary-title-container flex flex-col items-center gap-6 uppercase">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/assets/bestiary-logo.png"
            alt="Logo du bestiaire"
            width={80}
            height={80}
            className="object-contain"
          />
          <h2 className="font-uncial text-gold text-5xl">Bestiaire</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creatures.map((creature) => (
            <CreatureCard key={creature.id} creature={creature} />
          ))}
        </div>
      </div>
    </section>
  );
}
