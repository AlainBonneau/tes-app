"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import tesLogo from "../../../public/assets/tes-logo.png";

const navLinks = [
  { href: "/", label: "Accueil", className: "underline" },
  { href: "/bestiary", label: "Bestiaire" },
  { href: "/map", label: "Carte" },
  { href: "/tavern", label: "Taverne" },
  {
    href: "/login",
    label: "Connexion",
    className:
      "bg-blood text-parchment py-2 px-4 rounded-lg border border-gold hover:text-gold transition",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative">
      <nav className="bg-dark text-parchment border-3 border-gold shadow-lg">
        <div className="max-w-screen-xl mx-auto flex items-center justify-center h-20 px-6">
          <Link href="/" className="items-center pr-6 hidden md:flex">
            <Image src={tesLogo} alt="TES Logo" width={56} height={56} />
          </Link>

          {/* Desktop PC */}
          <div className="hidden md:flex items-center gap-6 font-uncial uppercase tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  link.className || "text-parchment"
                } hover:text-gold transition`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Menu burger */}
          <button
            className="md:hidden p-2"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {open && (
          <div className="md:hidden bg-dark border-t border-gold">
            <div className="flex flex-col items-center py-4 space-y-4 font-uncial uppercase">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`w-full text-center ${
                    link.className ?? "text-parchment"
                  } hover:text-gold transition`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
