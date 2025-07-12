"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BookOpen, Map, Users } from "lucide-react";
import AuthGuard from "../components/AuthGuard";

const adminLinks = [
  {
    label: "Administration bestiaire",
    href: "/admin/bestiary",
    icon: BookOpen,
  },
  {
    label: "Administration régions",
    href: "/admin/map",
    icon: Map,
  },
  {
    label: "Administration utilisateurs",
    href: "/admin/users",
    icon: Users,
  },
];

export default function AdminPage() {
  const router = useRouter();

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gold text-parchment font-serif flex flex-col">
        <div className="bg-blood h-[20vh] w-full flex items-center justify-center shadow-lg">
          <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
            Administration
          </h1>
        </div>

        <section className="flex-grow flex justify-center items-center py-8">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="w-full max-w-3xl bg-blood border-2 border-gold shadow-2xl rounded-2xl px-4 py-8 flex flex-col items-center gap-8"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-gold mb-2 uppercase tracking-wider font-uncial text-center">
              Menu d’administration
            </h2>
            <div className="w-full grid gap-6 sm:grid-cols-2">
              {adminLinks.map(({ label, href, icon: Icon }) => (
                <motion.button
                  key={href}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0px 0px 16px #e1c699",
                    backgroundColor: "#e1c69933",
                  }}
                  className="flex items-center justify-center gap-3 bg-rune text-gold px-6 py-5 rounded-xl font-bold uppercase tracking-wide border-2 border-sandstone shadow-md transition text-lg hover:bg-gold/20 hover:text-parchment"
                  onClick={() => router.push(href)}
                >
                  <Icon className="w-7 h-7" />
                  <span>{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </AuthGuard>
  );
}
