"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header>
      <nav className="bg-dark text-parchment border-y-4 border-gold px-6 py-4 shadow-lg flex justify-center items-center tracking-wider">
        <div className="flex items-center gap-6 font-uncial uppercase">
          <Link href="/" className="hover:text-gold transition underline">
            Accueil
          </Link>
          <Link
            href="/bestiary"
            className="hover:text-gold transition"
          >
            Bestiaire
          </Link>

          <Link href="/map" className="hover:text-gold transition">
            Carte
          </Link>
          <Link href="/tavern" className="hover:text-gold transition">
            Taverne
          </Link>
          <Link href="/login" className="bg-blood pt-2 pb-2 pl-4 pr-4 rounded-lg border border-gold hover:text-gold transition">
            Connexion
          </Link>
        </div>
      </nav>
    </header>
  );
}
