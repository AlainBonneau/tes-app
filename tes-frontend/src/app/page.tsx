// src/app/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import BestiarySection from "./components/BestiarySection";
import MyButton from "./components/MyButton";
import "./page.css"

export default function Home() {
  function handleStartAdventure() {
    const bestiarySection = document.getElementById("bestiary");
    if (bestiarySection) {
      bestiarySection.scrollIntoView({ behavior: "smooth" });
    }
  }

  const fadeSlide = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="app-container h-full w-full flex flex-col">
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
            de l’univers The Elder Scroll
          </p>
          <MyButton
            label="Commencer l'aventure"
            onClick={handleStartAdventure}
          />
        </motion.div>
      </section>

      <section className="flex items-center justify-center bg-gray-100">
        <BestiarySection />
      </section>

      <section
        id="bestiary"
        className="custom-gradient relative w-full text-white flex flex-col items-center justify-center min-h-screen py-10"
      >
        {/* Titre */}
        <h2 className="relative z-10 font-uncial font-bold uppercase text-blood text-4xl md:text-5xl mb-8 px-4 text-center">
          Lieux
        </h2>

        {/* Conteneur image + texte */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-6 md:gap-10 mt-20">
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            variants={fadeSlide}
            initial="hidden"
            whileInView={"visible"}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src="/assets/map.jpg"
              alt="Carte des lieux de Tamriel"
              width={600}
              height={360}
              className="md:w-full h-auto object-cover rounded-2xl shadow-lg"
            />
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 bg-blood rounded-2xl shadow-lg p-6 md:p-8 flex flex-col justify-betweengap-4 md:gap-6"
            variants={fadeSlide}
            initial="hidden"
            whileInView={"visible"}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-gold font-cinzel font-bold text-basle md:text-g leading-relaxed text-center max-h-[200px] overflow-y-auto">
              Plongez au cœur de Tamriel, le continent légendaire de l’univers
              The Elder Scrolls, façonné par des siècles d’histoire, de magie et
              de conflits. De la majestueuse province de Cyrodiil, siège de
              l’Empire, aux pics enneigés de Skyrim, terre des Nordiques et des
              dragons, chaque région possède son identité propre, sa culture,
              ses mystères.
            </p>

            <button
              className=" bg-gold text-dark text-sm font-cinzel font-black md:text-base py-2 px-6 md:py-3 md:px-8 rounded hover:bg-gold/80 transition cursor-pointer"
              onClick={() => (window.location.href = "/map")}
            >
              Explorer
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
