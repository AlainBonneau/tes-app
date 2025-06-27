"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/store";
import { motion } from "framer-motion";
import { ShieldCheck, BookOpen } from "lucide-react";
import AuthGuard from "../components/AuthGard";

export default function AdminPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // Toujours loader tant que pas hydraté
  const isAdmin = auth?.user?.role?.toLowerCase() === "admin";

  // Tant qu'on attend que la redirection ait lieu, on retourne rien
  if (!auth.token || !isAdmin) {
    return null;
  }

  return (
    // AuthGuard pour protéger la page, on utilise adminOnly pour vérifier le rôle admin
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-blood text-parchment font-serif">
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center border-b-4 border-gold shadow-lg">
          <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center tracking-wide flex items-center gap-2">
            <ShieldCheck className="inline w-8 h-8 text-gold" />
            Administration
          </h1>
        </div>
        <section className="max-w-3xl mx-auto mt-12 p-8 rounded-2xl bg-blood border-2 border-gold shadow-xl flex flex-col items-center gap-10">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="w-full flex flex-col gap-8 items-center"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-gold mb-2 uppercase tracking-wider font-uncial">
              Menu d’administration
            </h2>
            <div className="w-full flex flex-col md:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 12px #e1c699",
                  backgroundColor: "#e1c69933",
                }}
                className="flex items-center gap-3 bg-rune text-gold px-6 py-4 rounded-xl font-bold uppercase tracking-wide border-2 border-sandstone shadow-md transition cursor-pointer text-lg hover:bg-gold/20"
                onClick={() => router.push("/admin/bestiaire")}
              >
                <BookOpen className="w-6 h-6" />
                Administration bestiaire
              </motion.button>
            </div>
          </motion.div>
        </section>
      </div>
    </AuthGuard>
  );
}
