"use client";

import { useState } from "react";
import MonsterCard from "./MonsterCard";
import Image from "next/image";

export default function BestiarySection() {
  return (
    <section className="h-screen w-full bg-dark">
      <div className="bestiary-title-container flex items-center justify-center flex-col gap-6 uppercase">
        <Image
          src="/assets/bestiary-logo.png"
          alt="Titre du bestiaire"
          width={80}
          height={80}
          className="bestiary-title"
        />
        <h2 className="font-uncial text-gold text-5xl">Bestiaire</h2>
      </div>
      <div className="monster-img-container">
        {/* <MonsterCard /> */}
      </div>
    </section>
  );
}
