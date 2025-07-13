import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Book } from "../types/book";
import { useEffect, useState } from "react";

type BookModalProps = {
  book: Book | null;
  open: boolean;
  onClose: () => void;
};

function splitPages(text: string, charsPerPage = 1000): string[] {
  // Découpe sur les doubles sauts de ligne, sinon par tranche de X caractères
  if (!text) return [];
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const pages: string[] = [];
  let current = "";
  for (const para of paras) {
    if ((current + "\n\n" + para).length > charsPerPage && current) {
      pages.push(current);
      current = para;
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }
  if (current) pages.push(current);
  return pages;
}

export default function BookModal({ book, open, onClose }: BookModalProps) {
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    if (book?.content) {
      setPages(splitPages(book.content, 1400)); // Ajuste la longueur pour avoir des pages équilibrées
      setPage(0);
    }
  }, [book]);

  if (!open || !book) return null;

  // Responsive : si mobile, on n'affiche qu'une page, sinon deux
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const leftPage = pages[page] || "";
  const rightPage = !isMobile && pages[page + 1] ? pages[page + 1] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-2"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 30 }}
        transition={{ type: "spring", stiffness: 250, damping: 32 }}
        className={`
          relative flex flex-col items-center
          rounded-3xl border-[6px] border-[#523211] shadow-2xl
          bg-parchment font-serif
          w-full
          ${isMobile ? "max-w-md" : "max-w-4xl"}
          min-h-[340px] sm:min-h-[480px] md:min-h-[600px] max-h-[95vh]
          px-2 py-6 sm:py-10
          justify-center
        `}
      >
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 bg-blood text-gold rounded-full px-3 py-1 text-2xl font-bold hover:bg-blood/90 z-10"
        >
          <X size={28} />
        </button>
        {/* Header du livre */}
        <div className="flex items-center gap-4 mb-5 px-2 w-full justify-center">
          <Image
            src={book.imageUrl || "/assets/default-book.png"}
            alt={book.title}
            width={60}
            height={80}
            className="rounded-lg border-2 border-[#523211] shadow-md"
            draggable={false}
          />
          <div className="flex-1">
            <div className="text-center font-uncial text-blood font-bold text-2xl">
              {book.title}
            </div>
            <div className="text-sm text-stone text-center italic">
              {book.author ? `Auteur : ${book.author}` : "Auteur inconnu"}
            </div>
          </div>
        </div>
        {/* Livre ouvert */}
        <div
          className={`
          flex-1 flex ${
            isMobile ? "flex-col" : "flex-row"
          } gap-0 w-full max-w-full
          bg-parchment
          rounded-2xl border-[#523211] border-2
          shadow-inner
          overflow-hidden
          relative
        `}
        >
          {/* Page de gauche */}
          <div
            className={`
            flex-1 px-5 py-5 min-h-[200px] max-h-[60vh] overflow-y-auto
            border-r-2 border-[#523211] bg-parchment
            ${isMobile ? "border-none" : ""}
            font-serif text-blood text-[17px] leading-relaxed tracking-normal
            shadow-inner
          `}
            style={{ whiteSpace: "pre-wrap" }}
          >
            {leftPage}
          </div>
          {/* Page de droite */}
          {!isMobile && rightPage && (
            <div
              className={`
              flex-1 px-5 py-5 min-h-[200px] max-h-[60vh] overflow-y-auto
              bg-parchment font-serif text-blood text-[17px] leading-relaxed tracking-normal
              shadow-inner
            `}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {rightPage}
            </div>
          )}
        </div>
        {/* Navigation */}
        <div className="flex items-center justify-center gap-8 mt-6">
          <button
            onClick={() => setPage(Math.max(0, page - (isMobile ? 1 : 2)))}
            disabled={page === 0}
            className={`
              p-3 rounded-full border-2 border-[#523211] bg-gold text-blood hover:bg-gold/90
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow
              flex items-center justify-center
            `}
            aria-label="Page précédente"
          >
            <ChevronLeft size={28} />
          </button>
          <span className="font-bold text-blood font-cinzel text-lg">
            Page {page + 1}
            {rightPage && `-${page + 2}`} / {pages.length}
          </span>
          <button
            onClick={() =>
              setPage(
                Math.min(
                  pages.length - (isMobile ? 1 : 2),
                  page + (isMobile ? 1 : 2)
                )
              )
            }
            disabled={
              (isMobile && page >= pages.length - 1) ||
              (!isMobile && page >= pages.length - 2)
            }
            className={`
              p-3 rounded-full border-2 border-[#523211] bg-gold text-blood hover:bg-gold/90
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow
              flex items-center justify-center
            `}
            aria-label="Page suivante"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
