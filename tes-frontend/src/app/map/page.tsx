"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// Infos régions (inchangé)
const regions = [
  {
    id: "skyrim",
    name: "Bordeciel (Skyrim)",
    desc: "Région du nord de Tamriel, patrie des Nordiques.",
  },
  { id: "cyrodiil", name: "Cyrodiil", desc: "Cœur de l’Empire de Tamriel." },
  {
    id: "morrowind",
    name: "Morrowind",
    desc: "Terre ancestrale des Dunmers (Elfes noirs).",
  },
];

const ORIGINAL_WIDTH = 1200;
const ORIGINAL_HEIGHT = 800;

export default function TamrielMap() {
  const [selected, setSelected] = useState("skyrim");
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-gold flex flex-col items-center">
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Carte
        </h1>
      </div>
      <div
        ref={containerRef}
        className="relative mb-6 w-full max-w-4xl"
        style={{
          aspectRatio: `${ORIGINAL_WIDTH} / ${ORIGINAL_HEIGHT}`,
        }}
      >
        {/* Image de fond */}
        <Image
          src="/assets/tamriel.svg"
          alt="Carte de Tamriel"
          fill
          className="absolute top-0 left-0 w-full h-full pointer-events-none select-none-lg"
          draggable={false}
          style={{ objectFit: "contain" }}
        />
        {/* SVG interactif en overlay */}
        <svg
          viewBox={`0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}`}
          width="100%"
          height="100%"
          className="absolute top-0 left-0"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Skyrim */}
          <polygon
            points="1010,248 1152,324 1010,320"
            fill={
              selected === "skyrim"
                ? "rgba(192,178,131,0.6)"
                : "rgba(179,205,224,0.4)"
            }
            stroke="#555"
            strokeWidth={3}
            style={{ cursor: "pointer", transition: "fill 0.2s" }}
            onClick={() => setSelected("skyrim")}
          />
          {/* ... autres régions ... */}
        </svg>
      </div>
      {/* Infos dynamiques */}
      <div className="w-full max-w-lg bg-white/90 shadow-lg p-6 rounded-xl mb-4">
        <h2 className="text-xl font-bold mb-2 text-center">
          {regions.find((r) => r.id === selected)?.name}
        </h2>
        <p className="text-center">
          {regions.find((r) => r.id === selected)?.desc}
        </p>
      </div>
    </div>
  );
}
