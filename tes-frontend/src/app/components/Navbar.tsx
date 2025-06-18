"use client";

import Link from "next/link";
import Image from "next/image";
import tesLogo from "../../../public/assets/tes-logo.png";

export default function Navbar() {
  const navLinks = [
    {
      href: "/",
      label: "Accueil",
      className: "underline",
    },
    { href: "/bestiary", label: "Bestiaire" },
    { href: "/map", label: "Carte" },
    { href: "/tavern", label: "Taverne" },
    {
      href: "/login",
      label: "Connexion",
      className:
        "bg-blood pt-2 pb-2 pl-4 pr-4 rounded-lg border border-gold hover:text-gold transition",
    },
  ];

  return (
    <header>
      <nav className="bg-dark text-parchment border-y-4 border-gold px-6 py-4 shadow-lg flex justify-center items-center tracking-wider">
        <div className="flex items-center gap-6 font-uncial uppercase">
            <Image src={tesLogo} alt="TES Logo" className="h-14 w-14" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-gold transition ${
                link.className || "text-parchment"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
