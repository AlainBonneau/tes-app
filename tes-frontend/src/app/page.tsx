"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import BestiarySection from "./components/BestiarySection";
import MyButton from "./components/MyButton";

export default function Home() {
  const router = useRouter();
  // Fonction pour gérer le clic sur le bouton "Commencer l'aventure à l'accueil"
  function handleStartAdventure() {
    const bestiarySection = document.getElementById("bestiary");
    if (bestiarySection) {
      bestiarySection.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Animation pour la section Lieux
  const fadeSlide = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="app-container h-full w-full flex flex-col">
      {/* Section d'accueil avec image de fond et texte animé */}
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

      {/* Section Bestiaire disponible dans les composants */}
      <section className="flex items-center justify-center bg-gray-100">
        <BestiarySection />
      </section>

      {/* Section Lieux  */}
      <section
        id="bestiary"
        className="custom-gradient relative bg-gold w-full text-white flex flex-col items-center justify-center min-h-screen py-10"
      >
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
              className="md:w-full h- object-cover rounded-2xl shadow-lg"
            />
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 bg-blood rounded-2xl shadow-lg p-6 md:p-8 flex flex-col justify-between gap-4 md:gap-6"
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
              onClick={() => router.push("/map")}
            >
              Explorer
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section Taverne */}
      <section className="tavern-section min-h-screen w-full bg-blood px-4 py-10 flex flex-col items-center justify-center">
        <h2 className="text-gold font-uncial font-bold uppercase text-4xl md:text-5xl text-center mb-12">
          Rejoignez la taverne
        </h2>

        {/* Conteneur image + texte */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-6xl">
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            variants={fadeSlide}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src="/assets/tavern.png"
              alt="Carte de la taverne"
              width={500}
              height={300}
              className="w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto object-cover rounded-2xl shadow-lg"
            />
          </motion.div>
          <motion.div
            className="w-full md:w-1/2 bg-gold rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-center justify-between gap-6 text-center"
            variants={fadeSlide}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-blood text-base md:text-xl font-cinzel font-black mb-4">
              Entrez dans la taverne !
            </h3>
            <p className="text-dark font-cinzel font-bold text-base md:text-lg leading-relaxed">
              Discutez avec d&apos;autres aventuriers, partagez vos découvertes
              et laissez vos messages sur le mur des héros.
            </p>
            <button
              className="bg-blood text-gold text-sm font-cinzel font-black md:text-base py-2 px-6 md:py-3 md:px-8 rounded hover:bg-blood/80 transition cursor-pointer"
              onClick={() => router.push("/tavern")}
            >
              Explorer
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section Bibliothèque */}
      <section className="library h-[50vh] w-full bg-[url('/assets/library.webp')] bg-center bg-cover flex flex-col items-center justify-center text-center relative">
        <h2 className="text-parchment font-uncial font-bold uppercase text-4xl md:text-5xl text-center mb-12">
          Bibliothèque
        </h2>
        <button
          className=" bg-parchment text-dark text-sm font-cinzel font-black md:text-base py-2 px-6 md:py-3 md:px-8 rounded hover:bg-gold/80 transition cursor-pointer"
          onClick={() => router.push("/library")}
        >
          Rejoindre la bibliothèque
        </button>
      </section>
    </div>
  );
}
