import Image from "next/image";
import Link from "next/link";
import FadeInSection from "./FadeInSection";

export default function PlacesSection() {
  return (
    <section
      id="bestiary"
      className="custom-gradient relative bg-gold w-full text-white flex flex-col items-center justify-center min-h-screen py-10"
    >
      <h2 className="relative z-10 font-uncial font-bold uppercase text-blood text-4xl mb-8 px-4 text-center">
        Lieux
      </h2>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-6 md:gap-10 mt-20">
        <FadeInSection className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/assets/map.jpg"
            alt="Carte des lieux de Tamriel"
            width={600}
            height={360}
            className="w-full h-auto object-cover rounded-2xl shadow-lg"
          />
        </FadeInSection>

        <FadeInSection className="w-full md:w-1/2 bg-blood rounded-2xl shadow-lg p-6 md:p-8 flex flex-col justify-between gap-4 md:gap-6">
          <p className="text-gold font-cinzel font-bold text-base md:text-sm leading-relaxed text-center max-h-[200px] overflow-y-auto">
            Plongez au cœur de Tamriel, le continent légendaire de l’univers The
            Elder Scrolls, façonné par des siècles d’histoire, de magie et de
            conflits. De la majestueuse province de Cyrodiil, siège de l’Empire,
            aux pics enneigés de Skyrim, terre des Nordiques et des dragons,
            chaque région possède son identité propre, sa culture, ses mystères.
          </p>

          <Link
            href="/map"
            className="bg-gold text-dark text-sm font-cinzel font-black md:text-base py-2 px-6 md:py-3 md:px-8 rounded hover:bg-gold/80 transition cursor-pointer text-center"
          >
            Explorer
          </Link>
        </FadeInSection>
      </div>
    </section>
  );
}
