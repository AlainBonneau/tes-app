"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type ProfileSidebarCardProps = {
  avatar: string;
  role: string;
  username: string;
};

export default function ProfileSidebarCard({
  avatar,
  role,
  username,
}: ProfileSidebarCardProps) {
  return (
    <motion.section
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7 }}
      className="flex flex-col items-center bg-blood p-6 rounded-2xl shadow-xl w-full md:w-1/3 border-2 border-sandstone relative"
    >
      <div className="w-32 h-32 rounded-full border-4 border-gold overflow-hidden mb-3 bg-parchment shadow-md">
        <Image
          width={128}
          height={128}
          src={avatar || "/assets/default-profile-picture.jpg"}
          alt="Avatar de profil"
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="bg-gold px-4 py-1 rounded-xl font-bold text-blood mb-2 mt-1 shadow"
      >
        {role}
      </motion.div>

      <div className="text-xl font-extrabold tracking-wider mb-1 text-parchment">
        {username}
      </div>

      <p className="text-center text-sm italic mb-2 text-parchment opacity-90">
        Aventurier et érudit du passé, toujours en quête de connaissances
        anciennes.
      </p>
    </motion.section>
  );
}
