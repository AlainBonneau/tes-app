import { FastifyRequest, FastifyReply } from "fastify";
import { get } from "http";

// Début du typage
type GetByIdCommentRequest = FastifyRequest<{ Params: { id: string } }>;
type CreateCommentRequest = FastifyRequest<{
  Params: { postId: string };
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
