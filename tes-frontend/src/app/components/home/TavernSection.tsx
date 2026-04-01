import Image from "next/image";
import Link from "next/link";
import FadeInSection from "./FadeInSection";

export default function TavernSection() {
  return (
    <section className="tavern-section min-h-screen w-full bg-blood px-4 py-10 flex flex-col items-center justify-center">
      <h2 className="text-gold font-uncial font-bold uppercase text-4xl text-center mb-12">
        Rejoignez la taverne
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-6xl">
        <FadeInSection className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/assets/tavern.png"
            alt="Carte de la taverne"
            width={500}
            height={300}
            className="w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto object-cover rounded-2xl shadow-lg"
          />
        </FadeInSection>

        <FadeInSection className="w-full md:w-1/2 bg-gold rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-center justify-between gap-6 text-center">
          <h3 className="text-blood text-base md:text-xl font-cinzel font-black mb-4">
            Entrez dans la taverne !
          </h3>

          <p className="text-dark font-cinzel font-bold text-base md:text-lg leading-relaxed">
            Discutez avec d&apos;autres aventuriers, partagez vos découvertes et
            laissez vos messages sur le mur des héros.
          </p>

          <Link
            href="/tavern"
            className="bg-blood text-gold text-sm font-cinzel font-black md:text-base py-2 px-6 md:py-3 md:px-8 rounded hover:bg-blood/80 transition cursor-pointer text-center"
          >
            Explorer
          </Link>
        </FadeInSection>
      </div>
    </section>
  );
}
