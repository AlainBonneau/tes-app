"use client";

import { motion } from "framer-motion";
import MyButton from "../MyButton";

export default function HeroSection() {
  function handleStartAdventure() {
    const bestiarySection = document.getElementById("bestiary");

    if (bestiarySection) {
      bestiarySection.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section
      className="
        relative h-screen flex items-center justify-center
        bg-[url('/assets/bg.jpg')] bg-center bg-cover
      "
    >
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center space-y-6 font-cinzel"
      >
        <h1 className="font-uncial text-gold text-4xl md:text-5xl uppercase">
          Explorez
          <br />
          L&apos;univers de
          <br />
          Tamriel
        </h1>

        <p className="text-white">
          Bestiaire, Personnages, Lieux et secrets
          <br />
          de l’univers The Elder Scrolls
        </p>

        <MyButton label="Commencer l'aventure" onClick={handleStartAdventure} />
      </motion.div>
    </section>
  );
}
