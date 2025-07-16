"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Flame, Crown, Pen, MessageCircle } from "lucide-react";

const categories = [
  {
    id: "1",
    icon: <BookOpen size={28} />,
    name: "Lore & Histoire",
    desc: "Discussions sur l’histoire, les légendes et les races du monde d’Elder Scrolls.",
    topics: 28,
    lastPost: { author: "Elendur", date: "Hier à 21:15" },
  },
  {
    id: "2",
    icon: <Flame size={28} />,
    name: "Guides & Astuces",
    desc: "Partagez vos conseils, tutoriels et astuces pour tous les jeux de la saga.",
    topics: 42,
    lastPost: { author: "Sarya", date: "Aujourd’hui à 10:37" },
  },
  {
    id: "3",
    icon: <Crown size={28} />,
    name: "Communauté & RP",
    desc: "Rencontrez d’autres aventuriers, présentez-vous ou lancez des jeux de rôle.",
    topics: 16,
    lastPost: { author: "Darken", date: "Aujourd’hui à 12:02" },
  },
  {
    id: "4",
    icon: <Pen size={28} />,
    name: "Créations & Fan-Art",
    desc: "Montrez vos œuvres : fanfics, dessins, mods et screens.",
    topics: 19,
    lastPost: { author: "Ysmir", date: "Il y a 2h" },
  },
];

export default function ForumHomePage() {
  return (
    <main className="min-h-screen bg-gold text-dark pb-12 flex flex-col items-center">
      {/* Header */}
      <div className="bg-blood h-[20vh] w-full flex flex-col justify-center items-center shadow-lg relative mb-6">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center tracking-widest drop-shadow-md">
          La taverne
        </h1>
        <p className="text-parchment mt-2 text-lg italic opacity-90 text-center">
          “Les parchemins anciens n’attendent que vos histoires...”
        </p>
        <Link
          href="/forum/new-topic"
          className="absolute right-6 top-6 bg-gold text-blood px-5 py-2 rounded-xl font-bold shadow-md border-2 border-[#FFE1A9] hover:bg-gold/90 hover:scale-105 transition"
        >
          + Nouveau sujet
        </Link>
      </div>

      {/* Liste des catégories */}
      <div className="max-w-4xl w-full px-2 sm:px-6 flex flex-col gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + idx * 0.08, type: "spring" }}
            className="flex items-center bg-blood rounded-2xl border-2 border-gold shadow hover:shadow-lg hover:bg-blood/90 transition cursor-pointer group"
          >
            <div className="w-20 flex flex-col items-center justify-center h-full bg-[#FFF8E2] border-r-2 border-gold rounded-l-2xl p-3">
              <span className="text-blood">{cat.icon}</span>
            </div>
            <div className="flex-1 px-5 py-5">
              <Link href={`/forum/category/${cat.id}`}>
                <div className="text-2xl font-uncial text-gold group-hover:text-parchment transition">
                  {cat.name}
                </div>
              </Link>
              <div className="text-parchment/90 text-base mb-2">{cat.desc}</div>
              <div className="flex items-center gap-3 mt-3 text-sm font-serif text-parchment opacity-85">
                <MessageCircle size={16} className="mr-1" />
                <span>{cat.topics} sujets</span>
                <span className="mx-1">|</span>
                <span>
                  Dernier message&nbsp;
                  <span className="font-semibold">{cat.lastPost.author}</span>
                  &nbsp;•&nbsp;
                  <span className="italic">{cat.lastPost.date}</span>
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
