"use client";
import { motion } from "framer-motion";
import backgroundImage from "../../public/assets/bg.jpg";
import MyButton from "./components/MyButton";

export default function Home() {
  function handleButtonClick() {
    // Logique pour démarrer l'aventure
    console.log("Aventure commencée !");
  }

  return (
    <main>
      <section
        className="top-section h-screen w-full bg-center bg-no-repeat bg-cover bg-black/60
    bg-blend-overlay"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="title-container font-cinzel text-center flex flex-col items-center justify-center h-full gap-6">
          <h1 className="font-uncial text-gold text-5xl uppercase">
            Explorez
            <br /> L&apos;univers de
            <br /> Tamriel
          </h1>
          <p className="text-white mt-4">
            Bestiaire, Personnage, Lieux et secrets <br /> de l&apos;univers The
            Elder Scroll
          </p>
          <MyButton label="Commencer l'aventure" onClick={handleButtonClick} />
        </div>
      </section>
    </main>
  );
}
