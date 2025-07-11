"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "../api/axiosConfig";
import type { Region } from "../types/region";
import { motion, AnimatePresence } from "framer-motion";

const ORIGINAL_WIDTH = 1200;
const ORIGINAL_HEIGHT = 800;

export default function TamrielMap() {
  const [selected, setSelected] = useState<number | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchRegions();
  }, []);

  return (
    <div className="bg-gold flex flex-col items-center min-h-screen">
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Carte
        </h1>
      </div>
      <div className="p-6 text-center">
        <h3 className="font-cinzel font-bold text-blood text-2xl">
          Cliquez sur une zone de la carte pour voir les informations
        </h3>
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
              r={selected === region.id ? 14 : 11}
              fill={selected === region.id ? "#e1c699" : "#5a2a2a"}
              stroke="#222"
              strokeWidth={selected === region.id ? 5 : 3}
              className={`transition-all duration-200 outline-none focus:ring-2 focus:ring-gold cursor-pointer`}
              tabIndex={0}
              aria-label={region.name}
              onClick={() => setSelected(region.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelected(region.id);
                }
              }}
              onMouseEnter={(e) => {
                if (selected !== region.id)
                  e.currentTarget.setAttribute("fill", "#e1c699");
              }}
              onMouseLeave={(e) => {
                if (selected !== region.id)
                  e.currentTarget.setAttribute("fill", "#5a2a2a");
              }}
            >
              {/* Titre de la région */}
              <title>{region.name}</title>
            </circle>
          ))}
        </svg>
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-parchment/80 rounded-xl">
            <span className="text-blood font-bold text-xl animate-pulse">
              Chargement…
            </span>
          </div>
        )}
      </div>
      {/* Informations sur la région sélectionnée */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="md:w-1/2 sm:w-3/4 w-full bg-blood text-gold shadow-lg p-6 rounded-xl mb-4"
          >
            <Image
              src={
                regions.find((r) => r.id === selected)?.imageUrl ||
                "/assets/tavern.png"
              }
              alt={
                regions.find((r) => r.id === selected)?.name ||
                "Région de Tamriel"
              }
              width={1200}
              height={800}
              className="w-full h-auto mb-4 rounded-lg shadow-md"
              draggable={false}
            />
            <h2 className="text-xl font-bold mb-2 text-center font-cinzel">
              {regions.find((r) => r.id === selected)?.name}
            </h2>
            <p className="text-center font-sans text-lg">
              {regions.find((r) => r.id === selected)?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
