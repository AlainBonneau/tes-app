import Image from "next/image";
import { motion } from "framer-motion";
import type { Creature } from "../types/creatures";

export default function BestiaryCard({
  creature,
  i,
}: {
  creature: Creature;
  i: number;
}) {
  return (
    <motion.div
      className="bg-parchment rounded-2xl shadow-xl border-2 border-gold overflow-hidden hover:scale-105 transition-transform cursor-pointer flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07, duration: 0.5 }}
      whileHover={{
        scale: 1.06,
        boxShadow: "0 8px 40px #8B3A3A33",
        borderColor: "#a38b66",
      }}
    >
      <Image
        width={300}
        height={200}
        src={creature.imageUrl || "/images/default-creature.png"}
        alt={creature.name}
        className="w-full h-48 object-cover border-b-2 border-gold"
      />
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-bold text-blood font-cinzel uppercase mb-2 tracking-wide">
          {creature.name}
        </h2>
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-bold text-gold">Région :</span>{" "}
            {creature.regionId}
          </p>
          <p className="text-sm">
            <span className="font-bold text-gold">Type :</span> {creature.type}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
