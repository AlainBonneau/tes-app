import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage
type GetByIdPostRequest = FastifyRequest<{ Params: { id: string } }>;

type CreatedPostRequest = FastifyRequest<{
  Body: { title: string; content: string };
}>;

type UpdatedPostRequest = FastifyRequest<{
  Params: { id: string };
  Body: Partial<{ title: string; content: string }>;
}>;
// Fin du typage

export async function getAllPosts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const posts = await request.server.prisma.post.findMany({
      include: { author: { select: { id: true, username: true } } },
      orderBy: { createdAt: "desc" },
    });
    reply.send(posts);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des postes :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}
