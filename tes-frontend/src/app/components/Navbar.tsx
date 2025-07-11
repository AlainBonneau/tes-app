"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import api from "../api/axiosConfig";
import { logout } from "../features/auth/authSlice";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import tesLogo from "../../../public/assets/tes-logo.png";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/bestiary", label: "Bestiaire" },
  { href: "/map", label: "Carte" },
  { href: "/tavern", label: "Taverne" },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const isLoggedIn = auth.isAuthenticated;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (!auth.hydrated) {
    return null;
  }

  const menuVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    await api.post("/users/logout", {}, { withCredentials: true });
    dispatch(logout());
    router.push("/login");
  };

  // Fonction pour vérifier si le lien est actif
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="relative z-50">
      <nav className="bg-dark text-parchment border-3 border-gold shadow-lg">
        <div className="max-w-screen-xl mx-auto flex items-center justify-center h-20 px-6">
          <Link href="/" className=" hidden items-center pr-4  md:block">
            <Image src={tesLogo} alt="TES Logo" width={56} height={56} />
          </Link>
          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-6 font-uncial uppercase tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  text-parchment hover:text-gold transition
                  ${
                    isActive(link.href)
                      ? "underline decoration-gold decoration-2 underline-offset-8"
                      : ""
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            {/* Lien vers le profil */}
            {isLoggedIn && (
              <Link
                href="/profil"
                className={`text-parchment hover:text-gold transition ${
                  isActive("/profil")
                    ? "underline decoration-gold decoration-2 underline-offset-8"
                    : ""
                }`}
              >
                Profil
              </Link>
            )}
            {/* Lien vers l'administration */}
            {isLoggedIn && auth.user?.role === "admin" && (
              <Link
                href="/admin"
                className={`text-parchment hover:text-gold transition ${
                  isActive("/admin")
                    ? "underline decoration-gold decoration-2 underline-offset-8"
                    : ""
                }`}
              >
                Admin
              </Link>
            )}
            {/* Bouton de connexion/déconnexion */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-blood text-parchment py-2 px-4 rounded-lg border border-gold hover:text-gold transition cursor-pointer"
              >
                Déconnexion
              </button>
            ) : (
              <Link
                href="/login"
                className={`bg-blood text-parchment py-2 px-4 rounded-lg border border-gold hover:text-gold transition cursor-pointer ${
                  isActive("/login")
                    ? "underline decoration-gold decoration-2 underline-offset-8"
                    : ""
                }`}
              >
                Connexion
              </Link>
            )}
          </div>
          {/* Burger mobile */}
          <button
            className="md:hidden p-2"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden absolute top-0 left-0 w-full h-screen bg-dark"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-6 font-uncial uppercase">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-2xl text-parchment hover:text-gold transition
                    ${
                      isActive(link.href)
                        ? "underline decoration-gold decoration-2 underline-offset-8"
                        : ""
                    }
                  `}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {/* Lien vers le profil mobile */}
              {isLoggedIn && (
                <Link
                  href="/profil"
                  className={`text-2xl text-parchment hover:text-gold transition ${
                    isActive("/profil")
                      ? "underline decoration-gold decoration-2 underline-offset-8"
                      : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Profil
                </Link>
              )}
              {/* // Bouton administration */}
              {isLoggedIn && auth.user?.role === "admin" && (
                <Link
                  href="/admin"
                  className={`text-2xl text-parchment hover:text-gold transition ${
                    isActive("/admin")
                      ? "underline decoration-gold decoration-2 underline-offset-8"
                      : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Administration
                </Link>
              )}

              {/* Connexion/Déconnexion Mobile */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-blood text-parchment py-2 px-8 rounded-lg border border-gold hover:text-gold transition text-2xl"
                >
                  Déconnexion
                </button>
              ) : (
                <Link
                  href="/login"
                  className={`bg-blood text-parchment py-2 px-8 rounded-lg border border-gold hover:text-gold transition text-2xl ${
                    isActive("/login")
                      ? "underline decoration-gold decoration-2 underline-offset-8"
                      : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Connexion
                </Link>
              )}

              <button
                onClick={() => setOpen(false)}
                className="mt-12 p-2 rounded-full bg-parchment text-dark hover:bg-gold transition"
                aria-label="Fermer le menu"
              >
                <X size={32} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
