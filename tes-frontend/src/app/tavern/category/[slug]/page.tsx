"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import api from "@/app/api/axiosConfig";
import Loader from "@/app/components/Loader";
import { MessageCircle, Flame } from "lucide-react";
import { RootState } from "@/app/store";
import type { Post } from "@/app/types/post";

// Helper pour vérifier si le post est "nouveau"
function isNew(date: string | Date) {
  if (!date) return false;
  const created = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return diff < 24;
}

export default function CategoryTopicsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = useSelector((state: RootState) => state.auth);
  const isLoggedIn = auth.isAuthenticated;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get(`/posts?categorySlug=${slug}`)
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-gold font-serif text-[#3A2E1E]">
      <div className="bg-blood h-[20vh] w-full flex flex-col items-center justify-center mb-8 relative">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Taverne
        </h1>

        {/* Nouveau sujet button */}
        {isLoggedIn && (
          <Link
            href={`/tavern/new-topic?category=${slug}`}
            className="absolute right-8 top-1/2 -translate-y-1/2 bg-gold text-blood px-5 py-2 rounded-xl font-bold shadow-md border-2 border-[#FFE1A9] hover:bg-gold/90 hover:scale-105 transition"
          >
            + Nouveau sujet
          </Link>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-2 sm:px-6">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-parchment border border-gold shadow rounded-xl py-16 px-4 text-center text-blood font-uncial text-xl opacity-90">
            Aucun sujet pour cette catégorie.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7 pb-16">
            {posts.map((post) => (
              <Link
                href={`/tavern/post/${post.slug || post.id}`}
                key={post.id}
                className="group"
              >
                <div className=" relative bg-parchment border-2 border-[#523211] rounded-[1.5rem] shadow-xl hover:scale-[1.035] hover:border-gold hover:shadow-2xl transition flex flex-col h-full p-6 pt-7 pb-5 after:absolute after:inset-0 after:rounded-[1.4rem] after:border-2 after:border-[#ffe7b0cc] after:pointer-events-none after:opacity-50 ">
                  {/* Petit ruban "Nouveau" */}
                  {isNew(post.createdAt) && (
                    <span className="absolute -top-3 left-5 px-3 py-1 text-xs font-bold rounded-xl bg-flame text-parchment bg-blood shadow z-10 border border-[#E2703A] animate-pulse flex items-center gap-1">
                      <Flame size={14} /> Nouveau
                    </span>
                  )}

                  <div className="flex items-start gap-3 mb-2">
                    <h2 className="text-xl sm:text-2xl font-uncial font-bold text-blood flex-1">
                      {post.title}
                    </h2>
                  </div>

                  {/* Résumé du post si dispo */}
                  {post.summary && (
                    <div className="text-base text-[#3a2e1ea8] font-serif my-1 line-clamp-2 italic">
                      {post.summary}
                    </div>
                  )}

                  {/* Infos bas de carte */}
                  <div className="flex items-center gap-2 mt-6 text-xs sm:text-sm opacity-80">
                    <span>
                      Par&nbsp;
                      <span className="font-bold">
                        {post.author?.username || "Inconnu"}
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs px-3 py-1 bg-[#FFE1A9]/80 rounded-lg font-semibold border border-gold text-blood shadow-sm">
                      <MessageCircle size={14} className="mr-1 opacity-60" />
                      <span>
                        {post._count?.comments ?? post.commentsCount ?? 0}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
