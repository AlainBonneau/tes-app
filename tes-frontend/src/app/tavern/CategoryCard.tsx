import Link from "next/link";
import { BookOpen, Flame, Crown, Pen, MessageCircle } from "lucide-react";
import { JSX } from "react";
import type { Category } from "../types/category";

const iconMap: Record<string, JSX.Element> = {
  book: <BookOpen size={34} />,
  flame: <Flame size={34} />,
  crown: <Crown size={34} />,
  pen: <Pen size={34} />,
};

export function CategoryCard({ cat }: { cat: Category }) {
  return (
    <div
      className={` relative flex gap-0 items-stretch my-8 mx-auto max-w-3xl w-full rounded-3xl shadow-xl border-4 border-[#523211] bg-[#fff8e2] hover:bg-[#f7e6c2] transition-all duration-200 hover:scale-[1.015] group `}
      style={{
        background: "linear-gradient(115deg, #fffbe8 80%, #fdeeb3 100%)",
        boxShadow: "0 6px 36px #7b614120, 0 1px 12px #a67c5240",
      }}
    >
      {/* Bandeau bois foncé avec l’icône */}
      <div className="flex flex-col items-center justify-center min-w-[90px] bg-[#523211] rounded-l-2xl px-4 py-6 border-r-4 border-[#a67734]">
        <span className="text-gold drop-shadow-lg">
          {cat.icon ? (
            iconMap[cat.icon] || <BookOpen size={34} />
          ) : (
            <BookOpen size={34} />
          )}
        </span>
      </div>
      {/* Corps de la carte */}
      <div className="flex-1 flex flex-col justify-center px-6 py-5">
        <Link href={`/tavern/category/${cat.slug || cat.id}`}>
          <span className="font-uncial text-2xl text-[#523211] group-hover:text-blood transition-colors cursor-pointer drop-shadow">
            {cat.name}
          </span>
        </Link>
        <div className="text-lg text-[#4f3d21] mt-2 font-serif opacity-90">
          {cat.desc}
        </div>
        <div className="flex items-center gap-4 mt-4 text-[#7c6746] text-sm font-serif">
          <span className="flex items-center gap-1">
            <MessageCircle size={16} /> {cat.topics ?? 0} sujets
          </span>
          {cat.lastPost && (
            <>
              <span className="opacity-50">|</span>
              <span>
                Dernier&nbsp;
                <span className="font-semibold">{cat.lastPost.author}</span>
                <span className="opacity-70"> • </span>
                <span className="italic">{cat.lastPost.date}</span>
              </span>
            </>
          )}
        </div>
      </div>
      {/* Petit effet décoratif doré */}
      <div className="absolute top-3 right-6 pointer-events-none opacity-60 group-hover:opacity-90 transition">
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          className="animate-pulse"
        >
          <circle cx="19" cy="19" r="16" fill="#FFE1A9" />
        </svg>
      </div>
    </div>
  );
}
