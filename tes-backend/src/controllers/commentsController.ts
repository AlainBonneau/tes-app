import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage
type GetByIdCommentRequest = FastifyRequest<{ Params: { id: string } }>;
type CreateCommentRequest = FastifyRequest<{
  Params: { postId: string };
  Body: { content: string };
}>;
type UpdateCommentRequest = FastifyRequest<{
  Params: { id: string };
  Body: { content: string };
}>;
// Fin du typage

export async function getAllCommentsForPost(
  request: FastifyRequest<{ Params: { postId: string } }>,
  reply: FastifyReply
) {
  const postId = parseInt(request.params.postId, 10);
  const comments = await request.server.prisma.comment.findMany({
    where: { postId },
    include: { author: { select: { id: true, username: true } } },
    orderBy: { createdAt: "asc" },
  });
  reply.send(comments);
}

export async function createComment(
  request: CreateCommentRequest,
  reply: FastifyReply
) {
  const postId = parseInt(request.params.postId, 10);
  const { content } = request.body;
  if (!content) {
    return reply.status(400).send({ error: "content requis" });
  }
  const payload = (request as any).user as { id: number };

  try {
    // Vérifier que le post existe
    const postExists = await request.server.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!postExists) {
      return reply.status(404).send({ error: "Post non trouvé" });
    }

    const comment = await request.server.prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: payload.id } },
      },
    });
    reply.status(201).send(comment);
  } catch (err: any) {
    reply.status(500).send({
      error: "Impossible de créer le commentaire",
      details: err.message,
    });
  }
}

export async function updateComment(
  request: UpdateCommentRequest,
  reply: FastifyReply
) {
  const commentId = parseInt(request.params.id, 10);
  const { content } = request.body;
  const payload = (request as any).user as { id: number; role: string };

  if (!content) {
    return reply.status(400).send({ error: "Le champ content est requis." });
  }

  const existing = await request.server.prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  });

  if (!existing) {
    return reply.status(404).send({ error: "Commentaire non trouvé." });
  }

  if (existing.authorId !== payload.id && payload.role !== "admin") {
    return reply.status(403).send({ error: "Non autorisé" });
  }

  try {
    const updated = await request.server.prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
    reply.send(updated);
  } catch (error: any) {
    reply.status(500).send({
      error: "Impossible de mettre à jour le commentaire",
      details: error.message,
    });
  }
}

export async function deleteComment(
  request: GetByIdCommentRequest,
  reply: FastifyReply
) {
  const commentId = parseInt(request.params.id, 10);
  const payload = (request as any).user as { id: number; role: string };

  // Vérifier existence et droit : auteur ou admin
  const existing = await request.server.prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  });

  if (!existing) {
    return reply.status(404).send({ error: "Commentaire non trouvé" });
  }

  if (existing.authorId !== payload.id && payload.role !== "admin") {
    return reply.status(403).send({ error: "Non autorisé" });
  }

  try {
    await request.server.prisma.comment.delete({ where: { id: commentId } });
    reply.status(204).send();
  } catch (err: any) {
    reply
      .status(500)
      .send({ error: "Impossible de supprimer", details: err.message });
  }
}
