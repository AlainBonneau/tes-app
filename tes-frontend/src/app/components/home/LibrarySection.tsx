import Link from "next/link";

export default function LibrarySection() {
  return (
    <section className="library h-[50vh] w-full bg-[url('/assets/library.webp')] bg-center bg-cover flex flex-col items-center justify-center text-center relative">
      <h2 className="text-parchment font-uncial font-bold uppercase text-4xl text-center mb-12">
        Bibliothèque
      </h2>

      <Link
        href="/library"
        className="bg-parchment text-dark text-sm font-cinzel font-black md:text-base py-2 px-6 md:py-3 md:px-8 rounded hover:bg-gold/80 transition cursor-pointer text-center"
      >
        Rejoindre la bibliothèque
      </Link>
    </section>
  );
}
