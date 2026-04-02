import { MessageCircle } from "lucide-react";
import type { Comment } from "@/app/types/comment";

type CommentsSectionProps = {
  comments: Comment[];
  currentUserId?: string;
  currentUserRole?: string;
  onDeleteComment: (commentId: number) => Promise<void>;
};

export default function CommentsSection({
  comments,
  currentUserId,
  currentUserRole,
  onDeleteComment,
}: CommentsSectionProps) {
  const canDeleteComment = (comment: Comment) => {
    return (
      comment.author?.id === currentUserId ||
      currentUserRole === "admin" ||
      currentUserRole === "moderator"
    );
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
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
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-parchment border-l-4 border-gold px-6 py-3 rounded-xl shadow flex flex-col sm:flex-row gap-2 items-center justify-between"
            >
              <div className="flex items-center gap-1 sm:gap-2 w-full">
                <span className="font-bold text-blood">
                  {comment.author?.username ?? "Anonyme"}
                </span>

                <span className="text-xs opacity-60 ml-2">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>

              <div className="sm:ml-4 font-serif break-words break-all w-full">
                {comment.content}
              </div>

              {canDeleteComment(comment) && (
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-blood hover:text-gold transition font-bold text-xs px-3 py-2 rounded-lg border border-blood hover:bg-blood cursor-pointer"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
