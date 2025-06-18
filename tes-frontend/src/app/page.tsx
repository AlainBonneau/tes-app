"use client";
import { motion } from "framer-motion";
import backgroundImage from "../../public/assets/bg.jpg";

export default function Home() {
  return (
    <main>
      <section
        className="top-section h-screen w-full bg-center bg-no-repeat bg-cover bg-black/60
    bg-blend-overlay"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="title-container font-cinzel">
          <h1 className="font-uncial text-gold text-5xl">
            Explorez
            <br /> L&apos;univers de
            <br /> Tamriel
          </h1>
          <p>
            Bestiaire, Personnage, Lieux et secrets de l&apos;univers The Elder
            Scroll
          </p>
        </div>
      </section>
    </main>
  );
}
