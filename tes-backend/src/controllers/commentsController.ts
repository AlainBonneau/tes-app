import { FastifyRequest, FastifyReply } from "fastify";
import { get } from "http";

// Début du typage
type GetByIdCommentRequest = FastifyRequest<{ Params: { id: string } }>;
type CreatedCommentRequest = FastifyRequest<{
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
