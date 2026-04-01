"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";
import type { Region } from "../types/region";
import TamrielMapSection from "./components/TamrielMapSection";
import RegionDetailsCard from "./components/RegionDetailsCard";

export default function TamrielMapPage() {
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
            !Number.isNaN(region.x) &&
            !Number.isNaN(region.y),
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

  const selectedRegion = useMemo(() => {
    return regions.find((region) => region.id === selected) ?? null;
  }, [regions, selected]);

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

      <TamrielMapSection
        regions={regions}
        selected={selected}
        setSelected={setSelected}
        loading={loading}
      />

      <RegionDetailsCard region={selectedRegion} />
    </div>
  );
}
