"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import api from "@/app/api/axiosConfig";
import Loader from "@/app/components/Loader";
import { MessageCircle, UserCircle2 } from "lucide-react";
import { RootState } from "@/app/store";
import type { Post } from "@/app/types/post";
import type { Comment } from "@/app/types/comment";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);
  const isLoggedIn = auth.isAuthenticated;
  const user = auth.user;

  // Récupération du post et des commentaires
  useEffect(() => {
    setLoading(true);
    async function fetchAll() {
      try {
        const res = await api.get(`/posts/slug/${slug}`); // OK
        setPost(res.data);
        const coms = await api.get(`/posts/${res.data.id}/comments`);
        setComments(coms.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du post :", err);
        setPost(null);
        setComments([]);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchAll();
  }, [slug]);

  // Fonction pour gérer l'envoi d'un commentaire
  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setReplying(true);
    try {
      await api.post(`/posts/${post!.id}/comments`, { content: reply });
      // Recharge commentaires
      const coms = await api.get(`/posts/${post!.id}/comments`);
      setComments(coms.data);
      setReply("");
    } catch (err) {
      console.error("Erreur lors de l'envoi du commentaire :", err);
      alert("Erreur lors de l'envoi du commentaire. Veuillez réessayer.");
    } finally {
      setReplying(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader />
      </div>
    );

  if (!post)
    return (
      <div className="max-w-xl mx-auto mt-10 text-center text-blood font-uncial text-xl">
        Sujet introuvable.
      </div>
    );

  return (
    <div className="min-h-screen bg-gold font-serif text-[#3A2E1E] pb-10">
      {/* Header */}
      <div className="bg-blood h-[18vh] w-full flex items-center px-2 sm:px-8">
        <h1 className="text-2xl md:text-3xl font-uncial uppercase text-gold text-center flex-1">
          {post.title}
        </h1>
      </div>

      <div className="py-8 px-4">
        <Link
          href="/tavern"
          className="bg-blood text-gold px-4 py-2 rounded font-cinzel border border-gold hover:bg-blood/90 transition font-bold shadow cursor-pointer"
        >
          Retour à la taverne
        </Link>
      </div>

      {/* Post principal */}
      <div className="max-w-3xl mx-auto mt-8 bg-parchment border-2 border-[#523211] rounded-2xl shadow-xl p-7 sm:p-10 relative">
        <div className="flex items-center gap-3 mb-3">
          <UserCircle2 size={30} className="text-blood" />
          <span className="font-bold text-blood font-serif">
            {post.author?.username ?? "Inconnu"}
          </span>
          <span className="mx-2 opacity-60">•</span>
          <span className="text-xs opacity-60">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs px-3 py-1 bg-[#FFE1A9]/80 rounded-lg font-semibold border border-gold text-blood shadow-sm">
            <MessageCircle size={14} className="mr-1 opacity-60" />
            <span>{post._count?.comments ?? post.comments?.length ?? 0}</span>
          </span>
        </div>
        <div className="prose prose-lg font-serif max-w-none text-[#3A2E1E] leading-relaxed mb-2">
          {post.content}
        </div>
      </div>

      {/* Commentaires */}
      <div className="max-w-3xl mx-auto mt-10">
        <div className="mb-2 text-blood font-uncial text-lg flex items-center gap-2">
          <MessageCircle size={22} />
          Commentaires ({comments.length})
        </div>
        {comments.length === 0 ? (
          <div className="bg-parchment border border-gold shadow rounded-xl py-6 px-3 text-center text-blood opacity-90 mb-7">
            Aucun commentaire pour ce sujet.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {comments.map((com) => (
              <div
                key={com.id}
                className="bg-parchment border-l-4 border-gold px-6 py-3 rounded-xl shadow flex flex-col sm:flex-row gap-2 items-start"
              >
                <span className="font-bold text-blood">
                  {com.author?.username ?? "Anonyme"}
                </span>
                <span className="text-xs opacity-60 ml-2">
                  {com.createdAt
                    ? new Date(com.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
                <div className="sm:ml-4 font-serif">{com.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire de commentaire */}
      {isLoggedIn && (
        <div className="max-w-3xl mx-auto mt-10 mb-8">
          <form
            onSubmit={handleReply}
            className="bg-parchment border-2 border-gold rounded-xl shadow-lg p-5 flex flex-col gap-4"
          >
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              className="border rounded-lg p-3 font-serif text-base focus:outline-gold"
              placeholder="Écrire un commentaire..."
              required
              minLength={1}
            />
            <button
              type="submit"
              disabled={replying || !reply.trim()}
              className="bg-gold text-blood px-6 py-2 rounded-xl font-bold border-2 border-[#FFD679] hover:bg-blood hover:text-gold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {replying ? "Envoi en cours..." : "Publier le commentaire"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
