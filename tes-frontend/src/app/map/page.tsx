"use client";

import { useState } from "react";

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

export default function TamrielMap() {
  const [selected, setSelected] = useState("skyrim");

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Carte interactive de Tamriel</h1>
      <svg
        viewBox="0 0 600 300"
        width={600}
        height={300}
        className="mb-6"
        style={{ background: "#f3e5ca" }}
      >
        {/* Région Skyrim */}
        <path
          id="skyrim"
          d="M70,80 L170,60 L190,130 L110,160 Z"
          fill={selected === "skyrim" ? "#c0b283" : "#b3cde0"}
          stroke="#555"
          strokeWidth={2}
          style={{ cursor: "pointer" }}
          onClick={() => setSelected("skyrim")}
        />
        {/* Région Cyrodiil */}
        <path
          id="cyrodiil"
          d="M200,140 L300,120 L320,200 L220,220 Z"
          fill={selected === "cyrodiil" ? "#c0b283" : "#b3cde0"}
          stroke="#555"
          strokeWidth={2}
          style={{ cursor: "pointer" }}
          onClick={() => setSelected("cyrodiil")}
        />
        {/* Région Morrowind */}
        <path
          id="morrowind"
          d="M350,90 L470,100 L460,200 L370,170 Z"
          fill={selected === "morrowind" ? "#c0b283" : "#b3cde0"}
          stroke="#555"
          strokeWidth={2}
          style={{ cursor: "pointer" }}
          onClick={() => setSelected("morrowind")}
        />
        {/* Tu peux rajouter d'autres régions facilement */}
      </svg>
      {/* Affichage dynamique des infos */}
      <div className="w-full max-w-lg bg-white/90 shadow-lg p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-2">
          {regions.find((r) => r.id === selected)?.name}
        </h2>
        <p>{regions.find((r) => r.id === selected)?.desc}</p>
      </div>
    </div>
  );
}
