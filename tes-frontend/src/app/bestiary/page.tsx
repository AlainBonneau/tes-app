"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import BestiaryCard from "../components/BestiaryCard";
import Loader from "../components/Loader";
import api from "../api/axiosConfig";
import type { Creature } from "../types/creatures";

export default function BestiaryPage() {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCreatures() {
      try {
        setLoading(true);
        const response = await api.get("/creatures");
        setCreatures(response.data);
      } catch (error) {
        console.error("Erreur de chargement des créatures :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCreatures();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, filterType, filterRegion]);

  const typeList = useMemo(() => {
    return Array.from(new Set(creatures.map((c) => c.type)));
  }, [creatures]);

  const regionList = useMemo(
    () =>
      Array.from(new Set(creatures.map((c) => c.region?.name).filter(Boolean))),
    [creatures]
  );

  const filteredCreatures = useMemo(() => {
    return creatures.filter((c) => {
      const matchesType = filterType ? c.type === filterType : true;
      const matchesRegion = filterRegion
        ? c.region?.name === filterRegion
        : true;
      const matchesSearch = c.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesType && matchesRegion && matchesSearch;
    });
  }, [creatures, search, filterType, filterRegion]);

  const pageSize = 9;
  const totalPages = Math.ceil(filteredCreatures.length / pageSize);

  const paginatedCreatures = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCreatures.slice(start, start + pageSize);
  }, [filteredCreatures, page, pageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold via-parchment to-[#3a2e1e] font-serif text-[#3A2E1E]">
      {/* Titre */}
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Bestiaire
        </h1>
      </div>

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
      {loading ? (
        <Loader text="Chargement des créatures..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {paginatedCreatures.length > 0 ? (
            paginatedCreatures.map((creature, i) => (
              <Link key={creature.id} href={`/bestiary/${creature.id}`}>
                <BestiaryCard creature={creature} i={i} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-blood text-xl font-uncial">
              <span className="inline-block bg-parchment rounded-lg px-8 py-4 border-2 border-gold shadow">
                Aucun monstre ne correspond à votre recherche...
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center gap-4 pt-8 pb-8">
        <button
          disabled={page === 1}
          className={`px-6 py-2 rounded font-cinzel bg-blood border text-gold border-gold hover:bg-gold/80 transition ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Précédent
        </button>
        <span className="font-bold">
          {page} / {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          className={`px-6 py-2 rounded font-cinzel bg-blood text-gold border border-gold hover:bg-gold/80 transition ${
            page === totalPages || totalPages === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
