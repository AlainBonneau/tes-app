"use client";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/store";
import Loader from "./Loader"; // adapte le chemin

type Props = {
  /** Le contenu protégé */
  children: React.ReactNode;
  /** Doit-on vérifier le rôle admin ? */
  adminOnly?: boolean;
  /** Redirige vers cette URL en cas d'échec */
  redirectTo?: string;
};

/**
 * AuthGuard
 * Protégez vos routes par rôle (admin) ou simple authentification.
 */
export default function AuthGuard({
  children,
  adminOnly = false,
  redirectTo = "/",
}: Props) {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // On vérifie l’auth (et le rôle si demandé)
  const isLoggedIn = !!auth.token && !!auth.user;
  const isAdmin = auth.user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (auth.hydrated && (!isLoggedIn || (adminOnly && !isAdmin))) {
      router.replace(redirectTo); // replace = pas dans l’historique
    }
  }, [auth.hydrated, isLoggedIn, isAdmin, adminOnly, router, redirectTo]);

  // Attente d’hydratation Redux
  if (!auth.hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  // Tant qu’on attend la redirection, on ne montre rien
  if (!isLoggedIn || (adminOnly && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
