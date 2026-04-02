import Image from "next/image";
import { MessageCircle } from "lucide-react";
import type { Post } from "@/app/types/post";

type PostContentCardProps = {
  post: Post;
};

export default function PostContentCard({ post }: PostContentCardProps) {
  return (
    <div className="max-w-3xl mx-auto mt-8 bg-parchment border-2 border-[#523211] rounded-2xl shadow-xl p-7 sm:p-10 relative">
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={
            post.author?.imageUrl ||
            "https://res.cloudinary.com/dk0aq0vvw/image/upload/v1753326415/avatars/nm4ft8dkza6ejh6u8psr.webp"
          }
          alt={post.author?.username ?? "Inconnu"}
          width={30}
          height={30}
          className="rounded-full"
        />

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

      <div
        className="tiptap-content font-serif max-w-none text-[#3A2E1E] leading-relaxed mb-2 break-words"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
    </div>
  );
}
