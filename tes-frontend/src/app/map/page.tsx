"use client";

import { useState } from "react";
import Image from "next/image";

// Importer les données des régions depuis l'api (à faire plus tard)
const regions = [
  {
    id: "skyrim",
    name: "Bordeciel (Skyrim)",
    desc: "Région du nord de Tamriel, patrie des Nordiques.",
    x: 600,
    y: 150,
  },
  {
    id: "cyrodiil",
    name: "Cyrodiil",
    desc: "Cœur de l’Empire de Tamriel.",
    x: 800,
    y: 480,
  },
  {
    id: "morrowind",
    name: "Morrowind",
    desc: "Terre ancestrale des Dunmers (Elfes noirs).",
    x: 1050,
    y: 100,
  },
];

const ORIGINAL_WIDTH = 1200;
const ORIGINAL_HEIGHT = 800;

export default function TamrielMap() {
  const [selected, setSelected] = useState("skyrim");

  return (
    <div className="bg-gold flex flex-col items-center">
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Carte
        </h1>
      </div>
      <div
        className="relative mb-6 w-full max-w-6xl"
        style={{
          aspectRatio: `${ORIGINAL_WIDTH} / ${ORIGINAL_HEIGHT}`,
        }}
      >
        {/* Image de fond */}
        <Image
          src="/assets/tamriel.png"
          alt="Carte de Tamriel"
          fill
          className="absolute top-0 left-0 w-full h-full pointer-events-none select-none"
          draggable={false}
          style={{ objectFit: "contain" }}
        />
        {/* SVG pour les points cliquables */}
        <svg
          viewBox={`0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}`}
          className="absolute top-0 left-0 w-full h-full"
        >
          {regions.map((region) => (
            <circle
              key={region.id}
              cx={region.x}
              cy={region.y}
              r={selected === region.id ? 20 : 13}
              fill={selected === region.id ? "#b3cde0" : "#fff"}
              stroke="#222"
              strokeWidth={selected === region.id ? 5 : 3}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              onClick={() => setSelected(region.id)}
            />
          ))}
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
