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

export async function getPostById(
  request: GetByIdPostRequest,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id, 10);
    const post = await request.server.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true } },
        comments: {
          include: { author: { select: { id: true, username: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post) {
      return reply.status(404).send({ error: "Poste non trouvé" });
    }
    reply.send(post);
  } catch (error: any) {
    console.error("Erreur lors de la récupération du poste :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}
