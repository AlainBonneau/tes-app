import { z } from "zod";

export const CommentSchema = z.object({
  id: z.uuid().optional(), // ✅
  content: z.string().min(1, "Le contenu du commentaire est requis"),
  authorId: z.uuid().optional(), // ✅
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const UpdateCommentShcema = z.object({
  content: z.string().min(1, "Le contenu du commentaire est requis"),
});
