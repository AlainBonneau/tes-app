"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "../api/axiosConfig";
import type { Region } from "../types/region";

const ORIGINAL_WIDTH = 1200;
const ORIGINAL_HEIGHT = 800;

export default function TamrielMap() {
  const [selected, setSelected] = useState<number | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await api.get("/regions");
        const filtered = (response.data as Region[]).filter(
          (region) =>
            typeof region.x === "number" &&
            typeof region.y === "number" &&
            !isNaN(region.x) &&
            !isNaN(region.y)
        );
        setRegions(filtered);
        setSelected(filtered[0]?.id ?? null);
      } catch (error) {
        console.error("Erreur lors de la récupération des régions :", error);
      }
    };
    fetchRegions();
  }, []);

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
              r={selected === region.id ? 13 : 10}
              fill="#5a2a2a"
              stroke="#222"
              strokeWidth={selected === region.id ? 5 : 3}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              onClick={() => setSelected(region.id)}
            />
          ))}
        </svg>
      </div>
      {/* Infos dynamiques */}
      <div className="w-full max-w-lg bg-blood text-gold shadow-lg p-6 rounded-xl mb-4">
        <Image
          src={
            regions.find((r) => r.id === selected)?.imageUrl ||
            "/assets/tavern.png"
          }
          alt={
            regions.find((r) => r.id === selected)?.name || "Région de Tamriel"
          }
          width={400}
          height={200}
          className="w-full h-auto mb-4 rounded-lg shadow-md"
          draggable={false}
        />
        <h2 className="text-xl font-bold mb-2 text-center">
          {regions.find((r) => r.id === selected)?.name}
        </h2>
        <p className="text-center">
          {regions.find((r) => r.id === selected)?.description}
        </p>
      </div>
    </div>
  );
}
