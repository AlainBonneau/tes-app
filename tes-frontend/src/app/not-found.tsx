"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center  bg-gold text-blood">
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-4xl font-cinzel font-bold uppercase text-gold text-center">
          404
        </h1>
      </div>
      <div className="page-container w-full flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-5xl font-bold mb-4">404</h2>
        <h3 className="text-2xl mb-2">Page introuvable</h3>
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
    </div>
  );
}
