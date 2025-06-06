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

export async function createPost(
  request: CreatedPostRequest,
  reply: FastifyReply
) {
  const { title, content } = request.body;
  if (!title || !content) {
    return reply.status(400).send({ error: "titre et content requis" });
  }

  const payload = (request as any).user as { id: number };

  try {
    const post = await request.server.prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: payload.id } },
      },
    });

    return reply.status(201).send(post);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Impossible de créer le poste.",
      details: error.message,
    });
  }
}


