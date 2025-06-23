"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Creature } from "../types/creatures";

export interface CreatureCardProps {
  creature: Creature;
}

export default function CreatureCard({ creature }: CreatureCardProps) {
  return (
    <motion.div
      className="w-full max-w-sm h-100 bg-parchment border-4 border-gold rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between items-center p-6 text-center"
      whileHover={{ scale: 1.03, boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {creature.imageUrl && (
        <div className="relative w-full h-48 mb-4">
          <Image
            src={creature.imageUrl}
            alt={creature.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      )}

      <h3 className="text-2xl font-uncial text-dark uppercase mb-2">
        {creature.name}
      </h3>

      <p className="text-dark font-cinzel lowercase text-sm leading-snug line-clamp-4">
        {creature.description}
      </p>
    </motion.div>
  );
}
