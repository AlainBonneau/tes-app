import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Book } from "../types/book";

type BookModalProps = {
  book: Book | null;
  open: boolean;
  onClose: () => void;
};

// Fonction pour diviser le contenu en pages
function splitPages(text: string, charsPerPage = 750): string[] {
  if (!text) return [];
  text = text.replace(/\r\n/g, "\n");
  const pages: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = i + charsPerPage;
    if (end >= text.length) {
      pages.push(text.slice(i).trim());
      break;
    }
    let lastBreak = text.lastIndexOf(" ", end);
    const lastNL = text.lastIndexOf("\n", end);
    if (lastNL > lastBreak) lastBreak = lastNL;
    if (lastBreak <= i + 100) lastBreak = end;
    pages.push(text.slice(i, lastBreak).trim());
    i = lastBreak;
  }
  return pages.filter(Boolean);
}

export default function BookModal({ book, open, onClose }: BookModalProps) {
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Gérer les changements de page avec les touches fléchées
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setPage((p) => Math.max(0, p - (isMobile ? 1 : 2)));
      if (e.key === "ArrowRight")
        setPage((p) =>
          Math.min(pages.length - (isMobile ? 1 : 2), p + (isMobile ? 1 : 2)),
        );
      if (e.key === "Escape") onClose();
    },
    [pages.length, isMobile, onClose],
  );

  // Détecter la taille de l'écran pour ajuster le nombre de caractères par page
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mettre à jour les pages lorsque le livre change
  useEffect(() => {
    if (book?.content) {
      setPages(splitPages(book.content, isMobile ? 900 : 1400));
      setPage(0);
    }
  }, [book, isMobile]);

  // Ajouter les écouteurs d'événements pour les touches fléchées
  useEffect(() => {
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, open]);

  if (!open || !book) return null;

  // Afficher la page actuelle et la suivante si disponible
  const leftPage = pages[page] || "";
  const rightPage = !isMobile && pages[page + 1] ? pages[page + 1] : null;
  const prevPage = () => setPage(Math.max(0, page - (isMobile ? 1 : 2)));
  const nextPage = () =>
    setPage(
      Math.min(pages.length - (isMobile ? 1 : 2), page + (isMobile ? 1 : 2)),
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="relative w-full max-w-[95vw] sm:max-w-2xl lg:max-w-4xl"
      >
        <div className="relative rounded-[1.5rem] bg-gradient-to-br from-[#4a2c1d] via-[#5b3723] to-[#2f1b12] p-1.5 sm:p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="pointer-events-none absolute inset-y-4 left-0 w-3 rounded-l-[1rem] bg-gradient-to-b from-[#7a5337] via-[#caa27b] to-[#6a452d] sm:inset-y-6 sm:w-5" />

          <div className="relative flex max-h-[92vh] flex-col overflow-hidden rounded-[1.2rem] border-2 border-[#caa56b] bg-gradient-to-br from-[#5a3724] via-[#4a2d1f] to-[#2c1a13] px-3 py-3 sm:px-5 sm:py-5">
            <div className="pointer-events-none absolute inset-2 sm:inset-3 rounded-[1rem] border border-[#e5c78e]/40" />

            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#e7c98d] bg-[#6f2c1b] text-[#f6deb0] shadow-lg transition hover:scale-105 hover:bg-[#843521] active:scale-95 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
            >
              <X size={18} />
            </button>

            <div className="mb-4 flex shrink-0 items-center gap-3 pr-10 sm:mb-5 sm:gap-4 sm:pr-12">
              <div className="shrink-0 rounded-lg border-2 border-[#d6b27b] bg-[#f4e7c8] p-1 shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
                <Image
                  src={book.imageUrl || "/assets/default-book.png"}
                  alt={book.title}
                  width={isMobile ? 46 : 60}
                  height={isMobile ? 66 : 84}
                  className="rounded-md object-cover shadow-md"
                  draggable={false}
                />
              </div>

              <div className="min-w-0 flex-1 text-center">
                <h2 className="line-clamp-2 text-base font-extrabold tracking-wide text-[#f6deb0] drop-shadow sm:text-2xl lg:text-3xl">
                  {book.title}
                </h2>
                <p className="mt-1 text-[11px] italic text-[#e7d3ad] sm:text-sm lg:text-base">
                  {book.author ? `Auteur : ${book.author}` : "Auteur inconnu"}
                </p>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 overflow-scroll rounded-[1rem] border-2 border-[#d4b07a] bg-[#efe2c2] shadow-[inset_0_0_25px_rgba(92,54,23,0.18)] sm:border-4">
              {!isMobile && (
                <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-6 -translate-x-1/2 bg-gradient-to-r from-[#c9b08a] via-[#9b7a55] to-[#c9b08a] opacity-70 shadow-[inset_0_0_10px_rgba(0,0,0,0.25)] lg:w-8" />
              )}

              <div
                className={`flex h-full ${isMobile ? "flex-col" : "flex-row"}`}
              >
                <div
                  className={`relative flex-1 overflow-y-auto px-4 py-4 text-sm leading-6 text-[#4a2c1d] sm:px-6 sm:py-6 sm:text-[15px] lg:px-8 lg:py-7 lg:text-[17px] lg:leading-7 ${
                    !isMobile ? "border-r border-[#d7bf95]" : ""
                  } bg-gradient-to-br from-[#fffdf4] via-[#f8edd1] to-[#efe0bb]`}
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "'EB Garamond', serif",
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_27px,rgba(120,84,44,0.06)_28px)] bg-[length:100%_28px] sm:bg-[linear-gradient(to_bottom,transparent_31px,rgba(120,84,44,0.06)_32px)] sm:bg-[length:100%_32px]" />
                  <div className="relative z-[1]">{leftPage}</div>
                </div>

                {!isMobile && rightPage && (
                  <div
                    className="relative flex-1 overflow-y-auto bg-gradient-to-bl from-[#fffdf4] via-[#f8edd1] to-[#efe0bb] px-6 py-6 text-[15px] leading-7 text-[#4a2c1d] lg:px-8 lg:py-7 lg:text-[17px]"
                    style={{
                      whiteSpace: "pre-wrap",
                      fontFamily: "'EB Garamond', serif",
                    }}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_31px,rgba(120,84,44,0.06)_32px)] bg-[length:100%_32px]" />
                    <div className="relative z-[1]">{rightPage}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex shrink-0 flex-wrap items-center justify-center gap-3 sm:mt-5 sm:gap-6">
              <button
                onClick={prevPage}
                disabled={page === 0}
                aria-label="Page précédente"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d6b27b] bg-[#f1dfb7] text-[#4e2f1d] shadow-md transition hover:scale-105 hover:bg-[#fbf2db] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="rounded-full border border-[#d6b27b] bg-[#f4e4bf] px-4 py-2 text-xs font-bold text-[#7b2f10] shadow-sm sm:px-5 sm:text-sm lg:text-base">
                Page {page + 1}
                {rightPage && ` - ${page + 2}`} / {pages.length}
              </span>

              <button
                onClick={nextPage}
                disabled={
                  (isMobile && page >= pages.length - 1) ||
                  (!isMobile && page >= pages.length - 2)
                }
                aria-label="Page suivante"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d6b27b] bg-[#f1dfb7] text-[#4e2f1d] shadow-md transition hover:scale-105 hover:bg-[#fbf2db] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
