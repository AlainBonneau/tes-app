"use client";

import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/api/axiosConfig";
import type { Book } from "../types/book";
import Loader from "@/app/components/Loader";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await api.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des livres :", err);
        showToast("Erreur lors de la récupération des livres", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gold flex flex-col items-center">
      <div className="bg-blood w-full h-[18vh] flex items-center justify-center mb-10">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Bibliothèque
        </h1>
      </div>
      <div className="max-w-6xl w-full px-4">
        <h2 className="font-cinzel font-bold text-blood text-2xl mb-6 text-center">
          Parcourez les ouvrages de Tamriel
        </h2>
        {loading ? (
          <Loader text="Chargement des livres..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-20">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/library/${book.id}`}
                className="
                  bg-parchment/90 border-2 border-gold rounded-2xl shadow-md p-4
                  flex flex-col gap-3 hover:scale-105 hover:shadow-xl transition
                  cursor-pointer group
                "
              >
                <div className="w-full aspect-[3/4] bg-stone/10 rounded-xl flex items-center justify-center mb-2 overflow-hidden">
                  <Image
                    src={book.imageUrl || "/assets/book-placeholder.png"}
                    alt={book.title}
                    width={180}
                    height={240}
                    className="w-full h-auto object-contain drop-shadow-lg group-hover:scale-105 transition"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="font-uncial text-lg text-blood font-bold mb-1 text-center">
                    {book.title}
                  </h3>
                  <p className="text-sm text-sandstone italic text-center">
                    {book.author}
                  </p>
                  <p className="text-[15px] text-stone mt-2 text-center line-clamp-3">
                    {book.summary}
                  </p>
                </div>
              </Link>
            ))}
            {books.length === 0 && (
              <div className="col-span-full text-center text-blood font-bold mt-16">
                Aucun livre pour le moment.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
