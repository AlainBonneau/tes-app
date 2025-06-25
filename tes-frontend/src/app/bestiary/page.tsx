"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const creatures = [
  {
    id: 1,
    name: "Draugr",
    region: "Skyrim",
    type: "Mort-vivant",
    imageUrl:
      "https://raw.githubusercontent.com/AlainBonneau/tes-img-hosting/refs/heads/main/bestiary/ice-troll.png",
  },
  {
    id: 2,
    name: "Clannfear",
    region: "Oblivion",
    type: "Daedra",
    imageUrl:
      "https://raw.githubusercontent.com/AlainBonneau/tes-img-hosting/refs/heads/main/bestiary/ice-troll.png",
  },
  {
    id: 3,
    name: "Netch",
    region: "Morrowind",
    type: "Créature volante",
    imageUrl:
      "https://raw.githubusercontent.com/AlainBonneau/tes-img-hosting/refs/heads/main/bestiary/ice-troll.png",
  },
];

const typeList = Array.from(new Set(creatures.map((c) => c.type)));
const regionList = Array.from(new Set(creatures.map((c) => c.region)));

export default function BestiaryPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState<string | null>(null);

  // Recherche et filtres combinés
  const filteredCreatures = useMemo(() => {
    return creatures.filter((c) => {
      const matchesType = filterType ? c.type === filterType : true;
      const matchesRegion = filterRegion ? c.region === filterRegion : true;
      const matchesSearch = c.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesType && matchesRegion && matchesSearch;
    });
  }, [search, filterType, filterRegion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e1c699] via-[#f0e3c2] to-[#3a2e1e] font-serif text-[#3A2E1E] px-4 py-8">
      {/* Titre */}
      <h1 className="text-4xl text-center font-bold mb-8 text-blood tracking-wider font-uncial drop-shadow">
        BESTIAIRE
      </h1>

      {/* Filtres */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <button
          onClick={() => {
            setFilterType(null);
            setFilterRegion(null);
            setSearch("");
          }}
          className={`px-4 py-2 rounded font-cinzel shadow ${
            !filterType && !filterRegion && !search
              ? "bg-gold text-blood"
              : "bg-parchment text-blood hover:bg-gold/70"
          } transition`}
        >
          Tous
        </button>
        <select
          className="px-3 py-2 rounded border border-gold bg-parchment text-blood shadow focus:outline-gold"
          value={filterType ?? ""}
          onChange={(e) => setFilterType(e.target.value || null)}
        >
          <option value="">Type</option>
          {typeList.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 rounded border border-gold bg-parchment text-blood shadow focus:outline-gold"
          value={filterRegion ?? ""}
          onChange={(e) => setFilterRegion(e.target.value || null)}
        >
          <option value="">Région</option>
          {regionList.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Recherche..."
          className="px-4 py-2 rounded border border-gold bg-parchment text-blood w-56 shadow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Résultat */}
      <div className="text-center text-blood mb-4 font-cinzel">
        {filteredCreatures.length > 0
          ? `${filteredCreatures.length} résultat${
              filteredCreatures.length > 1 ? "s" : ""
            }`
          : "Aucun monstre trouvé"}
      </div>

      {/* Cartes des monstres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredCreatures.length > 0 ? (
          filteredCreatures.map((creature, i) => (
            <motion.div
              key={creature.id}
              className="bg-parchment rounded-2xl shadow-xl border-2 border-gold overflow-hidden hover:scale-105 transition-transform cursor-pointer flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 8px 40px #8B3A3A33",
                borderColor: "#a38b66",
              }}
            >
              <Image
                width={300}
                height={200}
                src={creature.imageUrl}
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
                    {creature.region}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold text-gold">Type :</span>{" "}
                    {creature.type}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-blood text-xl font-uncial">
            <span className="inline-block bg-parchment rounded-lg px-8 py-4 border-2 border-gold shadow">
              🦎 Aucun monstre ne correspond à votre recherche...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
