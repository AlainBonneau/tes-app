import { FastifyRequest, FastifyReply } from "fastify";

// Typages
type GetByIdCommentRequest = FastifyRequest<{ Params: { id: string } }>;
type CreateCommentRequest = FastifyRequest<{
  Params: { postId: string };
  Body: { content: string; parentId?: number };
}>;
type UpdateCommentRequest = FastifyRequest<{
  Params: { id: string };
  Body: { content: string };
}>;

// Contrôleurs pour obtenir les commentaires
export async function getAllCommentsForPost(
  request: FastifyRequest<{ Params: { postId: string } }>,
  reply: FastifyReply
) {
  const postId = parseInt(request.params.postId, 10);
  try {
    const comments = await request.server.prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        author: { select: { id: true, username: true, imageUrl: true } },
        children: {
          include: {
            author: { select: { id: true, username: true, imageUrl: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    reply.send(comments);
  } catch (err: any) {
    reply.status(500).send({
      error: "Impossible de récupérer les commentaires",
      details: err.message,
    });
  }
}

// Controller pour créer un commentaire
export async function createComment(
  request: CreateCommentRequest,
  reply: FastifyReply
) {
  const postId = parseInt(request.params.postId, 10);
  const { content, parentId } = request.body;
  if (!content) {
    return reply.status(400).send({ error: "content requis" });
  }
  const payload = (request as any).user as { id: number };

  if (content.length > 500) {
    return reply
      .status(400)
      .send({ error: "Le commentaire ne doit pas dépasser 500 caractères." });
  }

  try {
    const postExists = await request.server.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!postExists) {
      return reply.status(404).send({ error: "Post non trouvé" });
    }
    if (parentId) {
      const parentComment = await request.server.prisma.comment.findFirst({
        where: { id: parentId, postId },
        select: { id: true },
      });
      if (!parentComment) {
        return reply
          .status(400)
          .send({ error: "Commentaire parent introuvable sur ce post." });
      }
    }

    const comment = await request.server.prisma.comment.create({
      data: {
        content,
        postId,
        authorId: payload.id,
        parentId: parentId ?? undefined,
      },
      include: {
        author: { select: { id: true, username: true, imageUrl: true } },
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

// Controller pour mettre à jour un commentaire
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
      include: {
        author: { select: { id: true, username: true, imageUrl: true } },
      },
    });
    reply.send(updated);
  } catch (error: any) {
    reply.status(500).send({
      error: "Impossible de mettre à jour le commentaire",
      details: error.message,
    });
  }
}

// Controller pour supprimer un commentaire
export async function deleteComment(
  request: GetByIdCommentRequest,
  reply: FastifyReply
) {
  const commentId = parseInt(request.params.id, 10);
  const payload = (request as any).user as { id: number; role: string };

  // Vérifie existence et droit : auteur ou admin
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
