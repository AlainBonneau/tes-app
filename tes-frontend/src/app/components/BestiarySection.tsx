"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import CreatureCard from "./CreatureCard";
import MyButton from "./MyButton";
import { Creature } from "../types/creatures";
import api from "../api/axiosConfig";

export default function BestiarySection() {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [reload, setReload] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async function loadCreatures() {
      try {
        const { data } = await api.get<Creature[]>("/creatures");
        if (!Array.isArray(data) || data.length === 0) {
          setCreatures([]);
          return;
        }

        let fourCreatures: Creature[] = [];
        if (data.length >= 4) {
          const fourRandomIndices = new Set<number>();
          while (fourRandomIndices.size < 4) {
            const randomIndex = Math.floor(Math.random() * data.length);
            fourRandomIndices.add(randomIndex);
          }
          fourCreatures = Array.from(fourRandomIndices).map(
            (index) => data[index]
          );
        } else {
          fourCreatures = data;
        }
        setCreatures(fourCreatures);
      } catch (err) {
        console.error("Erreur fetch creatures:", err);
        setCreatures([]);
      }
    })();
  }, [reload]);

  function handleRandomCreature() {
    setReload((prev) => !prev);
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  return (
    <section className="w-full bg-dark py-16" id="bestiary">
      <div className="max-w-screen-xl mx-auto px-4 text-center uppercase space-y-12">
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

        {/* Grille responsive */}
        {creatures.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {creatures.map((creature, i) => (
              <motion.div
                key={creature.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <CreatureCard creature={creature} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-gold font-cinzel text-lg my-10">
            Aucune créature à afficher pour le moment.
          </div>
        )}

        <div className="flex justify-center items-center gap-6">
          <MyButton label="Autres créatures" onClick={handleRandomCreature} />
          <MyButton
            label="Voir le bestiaire"
            onClick={() => router.push("/bestiary")}
          />
        </div>
      </div>
    </section>
  );
}
