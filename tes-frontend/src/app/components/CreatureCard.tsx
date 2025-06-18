import Image from "next/image";
import { Creature } from "../types/creatures";

export interface CreatureCardProps {
  creature: Creature;
}

export default function CreatureCard({ creature }: CreatureCardProps) {
  return (
    <div
      className="
      max-w-xs bg-parchment border-4 border-gold
      rounded-2xl overflow-hidden shadow-lg
      hover:shadow-2xl transition-shadow
    "
    >
      {creature.imageUrl && (
        <Image
          src={creature.imageUrl}
          alt={creature.name}
          className="w-full object-cover"
        />
      )}
      <h3
        className="
        text-center text-3xl font-uncial text-dark uppercase py-4
      "
      >
        {creature.name}
      </h3>
    </div>
  );
}
