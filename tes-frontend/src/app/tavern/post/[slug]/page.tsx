"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "@/app/store";
import { useToast } from "@/app/context/ToastContext";
import { useServices } from "@/app/context/ServicesContext";
import Loader from "@/app/components/Loader";
import type { Post } from "@/app/types/post";
import type { Comment } from "@/app/types/comment";
import PostDetailHeader from "./components/PostDetailHeader";
import PostContentCard from "./components/PostContentCard";
import CommentsSection from "./components/CommentsSection";
import CommentForm from "./components/CommentForm";

export default function PostDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);

  const { showToast } = useToast();
  const { tavernService } = useServices();
  const auth = useSelector((state: RootState) => state.auth);
  const isLoggedIn = auth.isAuthenticated;

  useEffect(() => {
    if (!slug) return;

    const fetchPostAndComments = async () => {
      setLoading(true);

      try {
        const fetchedPost = await tavernService.getPostBySlug<Post>(slug);

        setPost(fetchedPost);

        const fetchedComments = await tavernService.listPostComments<Comment[]>(
          fetchedPost.id,
        );
        setComments(fetchedComments);
      } catch (err) {
        console.error("Erreur lors de la récupération du post :", err);
        setPost(null);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [slug, tavernService]);

  const refreshComments = async (postId: number) => {
    const comments = await tavernService.listPostComments<Comment[]>(postId);
    setComments(comments);
  };

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!reply.trim() || !post) return;

    if (reply.length > 500) {
      showToast(
        `Le commentaire ne doit pas dépasser 500 caractères, vous avez actuellement ${reply.length} caractères`,
        "error",
      );
      return;
    }

    setReplying(true);

    try {
      await tavernService.createPostComment(post.id, { content: reply });
      await refreshComments(post.id);
      setReply("");
      showToast("Commentaire publié avec succès !", "success");
    } catch (err) {
      console.error("Erreur lors de l'envoi du commentaire :", err);

      if (axios.isAxiosError(err)) {
        showToast(
          err.response?.data?.error || "Erreur lors de l'envoi du commentaire.",
          "error",
        );
      } else {
        showToast("Erreur lors de l'envoi du commentaire.", "error");
      }
    } finally {
      setReplying(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce commentaire ?",
    );

    if (!confirmed) return;

    try {
      await tavernService.deleteComment(commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId),
      );
      showToast("Commentaire supprimé avec succès !", "success");
    } catch (err) {
      console.error("Erreur lors de la suppression du commentaire :", err);
      showToast("Erreur lors de la suppression du commentaire.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full min-h-screen bg-gold flex justify-center items-center">
        <div className="border-2 border-blood px-20 py-20 rounded-2xl bg-blood text-center text-gold font-uncial text-xl">
          Poste introuvable.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gold font-serif text-[#3A2E1E] pb-10">
      <PostDetailHeader title={post.title} />

      <div className="py-8 px-4">
        <PostContentCard post={post} />
      </div>

      <CommentsSection
        comments={comments}
        currentUserId={auth.user?.id}
        currentUserRole={auth.user?.role}
        onDeleteComment={handleDeleteComment}
      />

      {isLoggedIn && (
        <CommentForm
          reply={reply}
          setReply={setReply}
          replying={replying}
          onSubmit={handleReply}
        />
      )}
    </div>
  );
}
