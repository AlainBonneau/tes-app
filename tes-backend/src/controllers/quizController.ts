import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createQuizInput, attemptInput } from "../schemas/quiz";

// Fonction pour lister les quizzes
export async function listQuizzes(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const quizzes = await request.server.prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return reply.send(quizzes);
}

// Fonction pour récupérer un quiz par son slug
export async function getQuizBySlug(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) {
  const { slug } = request.params;
  const quiz = await request.server.prisma.quiz.findUnique({
    where: { slug },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  });
  if (!quiz) return reply.status(404).send({ error: "Quiz introuvable" });
  return reply.send(quiz);
}

// Fonction pour créer un quiz
export async function createQuiz(
  request: FastifyRequest<{ Body: unknown }>,
  reply: FastifyReply
) {
  const parsed = createQuizInput.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.flatten() });
  }
  const { title, slug, questions } = parsed.data;

  const created = await request.server.prisma.quiz.create({
    data: {
      title,
      slug,
      questions: {
        create: questions.map((q, idx) => ({
          question: q.question,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          explanation: q.explanation,
          difficulty: q.difficulty,
          imageUrl: q.imageUrl,
          order: q.order ?? idx,
        })),
      },
    },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  return reply.status(201).send(created);
}

// Fonction pour soumettre une tentative
export async function submitAttempt(
  request: FastifyRequest<{ Params: { slug: string }; Body: unknown }>,
  reply: FastifyReply
) {
  const { slug } = request.params;
  const parsed = attemptInput.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.flatten() });
  }
  const quiz = await request.server.prisma.quiz.findUnique({ where: { slug } });
  if (!quiz) return reply.status(404).send({ error: "Quiz introuvable" });

  const { score, total, elapsedSeconds, details } = parsed.data;

  const userId = (request as any).user?.id ?? null;
  const attempt = await request.server.prisma.quizAttempt.create({
    data: {
      quizId: quiz.id,
      userId,
      score,
      total,
      elapsedSeconds,
      details,
    },
  });

  return reply.send({ ok: true, id: attempt.id });
}

// Fonction pour récupérer le classement
export async function leaderboard(
  request: FastifyRequest<{ Querystring: { slug: string; limit?: string } }>,
  reply: FastifyReply
) {
  const { slug, limit = "10" } = request.query;
  const quiz = await request.server.prisma.quiz.findUnique({ where: { slug } });
  if (!quiz) return reply.status(404).send({ error: "Quiz introuvable" });

  const rows = await request.server.prisma.quizAttempt.findMany({
    where: { quizId: quiz.id },
    orderBy: [
      { score: "desc" },
      { elapsedSeconds: "asc" },
      { createdAt: "asc" },
    ],
    take: Number(limit),
    select: {
      id: true,
      userId: true,
      score: true,
      total: true,
      elapsedSeconds: true,
      createdAt: true,
    },
  });

  return reply.send(rows);
}
