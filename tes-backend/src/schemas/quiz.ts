import { z } from "zod";

export const difficultyEnum = z.enum(["easy", "medium", "hard"]);

export const questionInput = z.object({
  question: z.string().min(3),
  options: z.array(z.string()).min(2),
  correctAnswerIndex: z.number().int().nonnegative(),
  explanation: z.string().optional(),
  difficulty: difficultyEnum.default("easy"),
  imageUrl: z.string().url().optional(),
  order: z.number().int().nonnegative().optional(),
});

export const createQuizInput = z.object({
  title: z.string().min(3),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
  questions: z.array(questionInput).min(1),
});

export const attemptInput = z.object({
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  elapsedSeconds: z.number().int().min(0),
  details: z.any(),
});

export type QuestionInput = z.infer<typeof questionInput>;
export type CreateQuizInput = z.infer<typeof createQuizInput>;
export type AttemptInput = z.infer<typeof attemptInput>;
