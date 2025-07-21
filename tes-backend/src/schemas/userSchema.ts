import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères"),
  email: z.email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.url("URL d'image invalide").optional(),
  description: z.string().optional(),
  birthdate: z.date().optional(),
  role: z.enum(["user", "moderator", "admin"]).default("user"),
});

export const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.url("URL d'image invalide").optional(),
  description: z.string().optional(),
  birthdate: z
    .string()
    .transform((val) => (val ? new Date(val) : undefined))
    .optional(),
});
