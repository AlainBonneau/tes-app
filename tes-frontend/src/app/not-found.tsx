"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gold text-blood">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-2">Page introuvable</h2>
      <p className="mb-8">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="bg-blood text-gold py-2 px-6 rounded font-cinzel font-bold hover:bg-blood/80 transition"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
