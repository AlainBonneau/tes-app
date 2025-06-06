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

export async function updatePost(
  request: UpdatedPostRequest,
  reply: FastifyReply
) {
  const postId = parseInt(request.params.id, 10);
  const { title, content } = request.body;
  const payload = (request as any).user as { id: number; role: string };

  const existingPost = await request.server.prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  // Vérifier si le poste éxiste
  if (!existingPost) {
    return reply.status(404).send({ error: "Poste non trouvé" });
  }

  // Vérifier si l'utilisateur est administrateur
  if (existingPost.authorId !== payload.id && payload.role !== "admin") {
    return reply.status(403).send({ error: "Non autorisé" });
  }

  const data: Record<string, any> = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;

  try {
    const updatedPost = await request.server.prisma.post.update({
      where: { id: postId },
      data,
    });

    reply.send(updatedPost);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Impossible de mettre à jour le poste.",
      details: error.message,
    });
  }
}
