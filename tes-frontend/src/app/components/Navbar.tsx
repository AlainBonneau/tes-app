"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header>
      <nav className="bg-dark text-parchment border-y-4 border-gold px-6 py-4 shadow-lg flex justify-center items-center tracking-wider">
        <div className="flex gap-6 text-lg font-uncial">
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
          <Link href="/login" className="hover:text-gold transition">
            Connexion
          </Link>
        </div>
      </nav>
    </header>
  );
}
