"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loader({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="relative mb-4"
      >
        <div className="rounded-full border-4 border-gold border-t-blood w-16 h-16 flex items-center justify-center shadow-lg">
          <Image
            src="/assets/tes-logo.png"
            alt="logo loader"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      </motion.div>
      <span className="font-cinzel text-blood font-bold text-lg tracking-wide mt-2">
        {text}
      </span>
    </div>
  );
}
