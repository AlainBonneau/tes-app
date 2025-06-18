// app/page.tsx
"use client";
import { motion } from "framer-motion";
import BestiarySection from "./components/BestiarySection";
import MyButton from "./components/MyButton";

export default function Home() {
  function handleButtonClick() {
    console.log("Aventure commencée !");
  }

  return (
    <div className="app-container h-full w-full flex flex-col">
       <section
        className="
          relative
          h-screen
          flex items-center justify-center
          w-full
          bg-[url('/assets/bg.jpg')]
          bg-center bg-no-repeat bg-cover
        "
      >
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center space-y-6 font-cinzel"
        >
          <h1 className="font-uncial text-gold text-5xl uppercase">
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
          <MyButton label="Commencer l'aventure" onClick={handleButtonClick} />
        </motion.div>
      </section>
        <section className="flex items-center justify-center bg-gray-100">
          <BestiarySection />
        </section>
    </div>
  );
}
