import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    return val;
  }, z.string().url("URL d'image invalide").optional()),
  description: z.string().optional(),
  birthdate: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") {
      const date = new Date(val);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  }, z.date().optional()),

  role: z.enum(["user", "moderator", "admin"]).default("user"),
});

export const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    return val;
  }, z.string().url("URL d'image invalide").optional()),
  description: z.string().optional(),
  birthdate: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") {
      const date = new Date(val);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  }, z.date().optional()),
});
