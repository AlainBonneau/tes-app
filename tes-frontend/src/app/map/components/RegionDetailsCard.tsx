"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Region } from "../../types/region";

type RegionDetailsCardProps = {
  region: Region | null;
};

export default function RegionDetailsCard({ region }: RegionDetailsCardProps) {
  return (
    <AnimatePresence mode="wait">
      {region && (
        <motion.div
          key={region.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25 }}
          className="md:w-1/2 sm:w-3/4 w-full bg-blood text-gold shadow-lg p-6 rounded-xl mb-4"
        >
          <Image
            src={region.imageUrl || "/assets/tavern.png"}
            alt={region.name || "Région de Tamriel"}
            width={1200}
            height={800}
            className="w-full h-auto mb-4 rounded-lg shadow-md"
            draggable={false}
          />

          <h2 className="text-xl font-bold mb-2 text-center font-cinzel">
            {region.name}
          </h2>

          <div
            className="text-center font-sans break-words overflow-y-auto scrollbar-thin scrollbar-thumb-gold/40 scrollbar-track-blood/30 w-full px-2 max-h-[110px] sm:max-h-[150px] md:max-h-[200px] lg:max-h-[280px] mx-auto transition-all"
            style={{
              lineHeight: "1.7",
              fontSize: "1.06rem",
            }}
          >
            {region.description}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
