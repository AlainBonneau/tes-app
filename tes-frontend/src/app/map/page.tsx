"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "../api/axiosConfig";
import type { Region } from "../types/region";

type RegionWithCoords = Region & {
  x: number;
  y: number;
};

type RegionPositions = {
  [key: number]: { x: number; y: number };
};

const ORIGINAL_WIDTH = 1200;
const ORIGINAL_HEIGHT = 800;

// Mapping ID  x, y pour chaque région
const regionPositions: RegionPositions = {
  1: { x: 600, y: 150 }, // Bordeciel
  2: { x: 500, y: 400 }, // Cyrodiil
  3: { x: 900, y: 335 }, // Morrowind
  4: { x: 150, y: 350 }, // Martelfell
  5: { x: 200, y: 200 }, // Hauteroche
  6: { x: 300, y: 700 }, // Val-Boisé
  7: { x: 1100, y: 600 }, // Archipel de l’Automne
  8: { x: 900, y: 750 }, // Elsweyr
  9: { x: 1150, y: 400 }, // Marais Noir
};

export default function TamrielMap() {
  const [selected, setSelected] = useState<number | null>(null);
  const [regions, setRegions] = useState<RegionWithCoords[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await api.get("/regions");
        const withCoords: RegionWithCoords[] = (response.data as Region[])
          .map((region: Region) => ({
            ...region,
            x: regionPositions[region.id]?.x,
            y: regionPositions[region.id]?.y,
          }))
          .filter(
            (region): region is RegionWithCoords =>
              region.x !== undefined && region.y !== undefined
          );
        setRegions(withCoords);
        setSelected(withCoords[0]?.id || null);
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
              fill={selected === region.id ? "#5a2a2a" : "#5a2a2a"}
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
