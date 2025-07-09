"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import AuthGuard from "../components/AuthGuard";

export default function AdminPage() {
  const router = useRouter();

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold text-parchment font-serif">
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
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
                onClick={() => router.push("/admin/bestiary")}
              >
                <BookOpen className="w-6 h-6" />
                Administration bestiaire
              </motion.button>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 12px #e1c699",
                  backgroundColor: "#e1c69933",
                }}
                className="flex items-center gap-3 bg-rune text-gold px-6 py-4 rounded-xl font-bold uppercase tracking-wide border-2 border-sandstone shadow-md transition cursor-pointer text-lg hover:bg-gold/20"
                onClick={() => router.push("/admin/map")}
              >
                <BookOpen className="w-6 h-6" />
                Administration régions
              </motion.button>
            </div>
          </motion.div>
        </section>
      </div>
    </AuthGuard>
  );
}
