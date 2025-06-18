import Image from "next/image";
import { Creature } from "../types/creatures";

export interface CreatureCardProps {
  creature: Creature;
}

export default function CreatureCard({ creature }: CreatureCardProps) {
  return (
    <div
      className="
      w-full max-w-sm            /* occupe 100% de sa colonne, jusqu'à 24rem */
      bg-parchment
      border-4 border-gold
      rounded-2xl
      overflow-hidden
      shadow-lg hover:shadow-2xl transition-shadow
      flex flex-col items-center p-6 text-center
    "
    >
      {creature.imageUrl && (
        <div className="relative w-full h-48 mb-4">
          <Image
            src={creature.imageUrl}
            alt={creature.name}
            fill
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
    </div>
  );
}
