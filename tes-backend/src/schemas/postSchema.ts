import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(3, "Le titre est trop court"),
  content: z.string().min(10, "Le contenu est trop court"),
  categoryId: z.number(),
  pinned: z.boolean().optional(),
  locked: z.boolean().optional(),
  slug: z.string().optional(),
});

export const UpdatePostSchema = z.object({
  title: z.string().min(3, "Le titre est trop court").optional(),
  content: z.string().min(10, "Le contenu est trop court").optional(),
  categoryId: z.number().optional(),
  pinned: z.boolean().optional(),
  locked: z.boolean().optional(),
  slug: z.string().optional(),
});
