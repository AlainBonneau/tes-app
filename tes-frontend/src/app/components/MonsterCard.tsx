// app/components/MonsterCard.tsx
export type Monster = {
  id: number;
  name: string;
  imageUrl: string;
  // …autres propriétés (vie, attaque, etc.) si besoin
};

export default function MonsterCard({ monster }: { monster: Monster }) {
  return (
    <div
      className="
      max-w-xs
      bg-parchment
      border-4 border-gold
      rounded-2xl
      overflow-hidden
      shadow-lg
      hover:shadow-2xl
      transition-shadow
    "
    >
      <img
        src={monster.imageUrl}
        alt={monster.name}
        className="w-full object-cover"
      />
      <h3
        className="
        text-center
        text-3xl
        font-uncial
        text-dark
        uppercase
        py-4
      "
      >
        {monster.name}
      </h3>
    </div>
  );
}
