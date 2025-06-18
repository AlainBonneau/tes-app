"use client";

import { useState } from "react";
import Image from "next/image";

export default function BestiarySection() {
  return (
    <section className="h-screen w-full bg-dark">
      <div className="bestiary-title-container">
        <Image
          src="/assets/bestiary-logo.png"
          alt="Titre du bestiaire"
          width={80}
          height={80}
          className="bestiary-title"
        />
        <h2>Bestiaire</h2>
      </div>
    </section>
  );
}
