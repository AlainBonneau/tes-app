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

// Couleurs
const PARCHMENT = "#FFFDF6";
const BOOK = "#523211";
const BLOOD = "#7B2F10";
const GOLD = "#FFDFA6";

// Fonction pour diviser le contenu en pages
function splitPages(text: string, charsPerPage = 1200): string[] {
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
          Math.min(pages.length - (isMobile ? 1 : 2), p + (isMobile ? 1 : 2))
        );
      if (e.key === "Escape") onClose();
    },
    [pages.length, isMobile, onClose]
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
      Math.min(pages.length - (isMobile ? 1 : 2), page + (isMobile ? 1 : 2))
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-1 sm:px-2"
      style={{ backdropFilter: "blur(3px)" }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 30 }}
        transition={{ type: "spring", stiffness: 250, damping: 32 }}
        className={` relative flex flex-col items-center rounded-[2.3rem] border-double border-[7px] border-[${BOOK}] shadow-[0_10px_80px_#52321199,0_2px_12px_#7B2F1025] bg-[${PARCHMENT}] w-full ${
          isMobile ? "max-w-xs sm:max-w-md" : "max-w-4xl"
        } min-h-[220px] sm:min-h-[340px] md:min-h-[500px] max-h-[92vh] px-1 sm:px-8 py-5 sm:py-10 justify-center `}
        style={{
          boxShadow: "0 8px 50px #43221188, 0 1.5px 10px #0002",
          borderColor: "#694b2f",
          background:
            "repeating-linear-gradient(135deg, #6b472c 0 25px, #785339 25px 50px, #6b472c 50px 60px)",
        }}
      >
        {/* Fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 bg-blood text-gold rounded-full px-2 py-1 text-xl font-bold hover:bg-blood/90 shadow-lg ring-2 ring-gold ring-offset-2 z-20 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{
            boxShadow: "0 2px 8px #52321155",
          }}
        >
          <X size={26} />
        </button>

        {/* Header livre */}
        <div className="flex items-center gap-4 mb-4 px-2 w-full justify-center">
          <div className="bg-[#fff7da] rounded-[1rem] p-1 border-4 border-[#FFDFA6] shadow-lg flex items-center justify-center min-w-[56px] min-h-[80px]">
            <Image
              src={book.imageUrl || "/assets/default-book.png"}
              alt={book.title}
              width={48}
              height={70}
              className="rounded-lg border-2 border-[#E9D9A3] shadow-sm"
              draggable={false}
            />
          </div>
          <div className="flex-1">
            <div
              className="text-center font-uncial font-extrabold text-[1.7rem] sm:text-3xl"
              style={{
                color: GOLD,
                textShadow: "0 1px 2px #523211, 0 0px 10px #FFE09C99",
                letterSpacing: "0.04em",
              }}
            >
              {book.title}
            </div>
            <div className="text-xs sm:text-sm text-gold text-center italic font-serif">
              {book.author ? `Auteur : ${book.author}` : "Auteur inconnu"}
            </div>
          </div>
        </div>

        {/* Pages */}
        <div
          className={` flex-1 flex ${
            isMobile ? "flex-col" : "flex-row"
          } w-full max-w-full bg-[${PARCHMENT}] rounded-2xl border-[${BOOK}] border-[3.5px] shadow-inner overflow-hidden relative `}
          style={{
            boxShadow: "inset 0 1px 36px #decfb399",
            borderColor: BOOK,
          }}
        >
          {/* Page gauche */}
          <div
            className={` flex-1 px-4 py-5 min-h-[100px] max-h-[60vh] overflow-y-auto font-serif text-[#432400] text-base sm:text-[18px] leading-relaxed tracking-normal bg-gradient-to-br from-[#fffde8] via-[#faedd6] to-[#f7ecd7] shadow-[inset_4px_0_32px_-6px_#dfc494] ${
              !isMobile ? "border-r-2 border-[#decfb3]" : ""
            } `}
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "'EB Garamond', serif",
              background: isMobile
                ? "linear-gradient(100deg, #fffde8 60%, #faedd6 120%)"
                : "linear-gradient(100deg, #fffde8 40%, #f7ecd7 100%)",
            }}
          >
            {leftPage}
          </div>
          {/* Page droite */}
          {!isMobile && rightPage && (
            <div
              className={` flex-1 px-4 py-5 min-h-[100px] max-h-[60vh] overflow-y-auto font-serif text-[#432400] text-base sm:text-[18px] leading-relaxed tracking-normal bg-gradient-to-br from-[#fffde8] via-[#faedd6] to-[#f7ecd7] shadow-[inset_-4px_0_32px_-6px_#decfb399] `}
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "'EB Garamond', serif",
                background:
                  "linear-gradient(100deg, #fffde8 60%, #faedd6 120%)",
              }}
            >
              {rightPage}
              {/* Effet "reliure" */}
              <div
                className="absolute top-0 left-0 h-full w-2 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, #decfb355 30%, #fff0 100%)",
                  zIndex: 1,
                }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-8 mt-6">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className={` p-3 rounded-full border-2 border-[#e9d9a3] bg-[#FFE9B9] text-[#523211] hover:bg-[#FFFDF6] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl flex items-center justify-center transition-all duration-150 cursor-pointer `}
            aria-label="Page précédente"
            style={{
              boxShadow: "0 2px 14px #cfc5b2cc",
            }}
          >
            <ChevronLeft size={28} />
          </button>
          <span
            className="font-bold font-cinzel text-base sm:text-lg"
            style={{
              color: BLOOD,
              background: "#ffe9b982",
              borderRadius: "12px",
              padding: "2px 14px",
              border: "1.5px solid #decfb3",
              boxShadow: "0 1px 5px #fff6e933",
            }}
          >
            Page {page + 1}
            {rightPage && `-${page + 2}`} / {pages.length}
          </span>
          <button
            onClick={nextPage}
            disabled={
              (isMobile && page >= pages.length - 1) ||
              (!isMobile && page >= pages.length - 2)
            }
            className={` p-3 rounded-full border-2 border-[#e9d9a3] bg-[#FFE9B9] text-[#523211] hover:bg-[#FFFDF6] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl flex items-center justify-center transition-all duration-150 cursor-pointer `}
            aria-label="Page suivante"
            style={{
              boxShadow: "0 2px 14px #cfc5b2cc",
            }}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
