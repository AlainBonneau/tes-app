import { FastifyRequest, FastifyReply } from "fastify";

// Controlleur pour les catégories de forum
export async function getAllForumCategories(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const categories = await request.server.prisma.forumCategory.findMany({
      include: { posts: { select: { id: true } } },
      orderBy: { name: "asc" },
    });
    reply.send(categories);
  } catch (error: any) {
    reply.status(500).send({
      error: "Impossible de charger les catégories.",
      details: error.message,
    });
  }
}

// Controlleur pour obtenir une catégorie de forum par ID ou slug
export async function getForumCategoryById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const id = isNaN(Number(request.params.id))
    ? undefined
    : Number(request.params.id);
  const slug = !id ? request.params.id : undefined;

  try {
    const category = await request.server.prisma.forumCategory.findUnique({
      where: id ? { id } : { slug },
      include: { posts: true },
    });
    if (!category)
      return reply.status(404).send({ error: "Catégorie non trouvée" });
    reply.send(category);
  } catch (error: any) {
    reply
      .status(500)
      .send({ error: "Erreur serveur.", details: error.message });
  }
}

// Controlleur pour créer des catégories de forum
export async function createForumCategory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const payload = (request as any).user as { role: string };
  if (payload?.role !== "admin")
    return reply.status(403).send({ error: "Accès interdit." });

  const { name, desc, icon, slug } = request.body as {
    name: string;
    desc: string;
    icon?: string;
    slug: string;
  };
  if (!name || !slug)
    return reply.status(400).send({ error: "Champs requis : name, slug" });

  try {
    const category = await request.server.prisma.forumCategory.create({
      data: { name, desc, icon, slug },
    });
    reply.status(201).send(category);
  } catch (error: any) {
    reply
      .status(500)
      .send({ error: "Erreur lors de la création.", details: error.message });
  }
}

// Controlleur pour mettre à jour une catégorie de forum
export async function updateForumCategory(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const payload = (request as any).user as { role: string };
  if (payload?.role !== "admin")
    return reply.status(403).send({ error: "Accès interdit." });

  const id = Number(request.params.id);
  const { name, desc, icon, slug } = request.body as {
    name?: string;
    desc?: string;
    icon?: string;
    slug?: string;
  };

  try {
    const updated = await request.server.prisma.forumCategory.update({
      where: { id },
      data: { name, desc, icon, slug },
    });
    reply.send(updated);
  } catch (error: any) {
    reply.status(500).send({
      error: "Erreur lors de la mise à jour.",
      details: error.message,
    });
  }
}

// Controlleur pour supprimer une catégorie de forum
export async function deleteForumCategory(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const payload = (request as any).user as { role: string };
  if (payload?.role !== "admin")
    return reply.status(403).send({ error: "Accès interdit." });

  const id = Number(request.params.id);
  try {
    await request.server.prisma.forumCategory.delete({ where: { id } });
    reply.status(204).send();
  } catch (error: any) {
    console.error("Erreur Prisma deleteForumCategory:", error);
    if (error.code === "P2003") {
      return reply.status(409).send({
        error:
          "Impossible de supprimer la catégorie car elle possède des posts.",
      });
    }
    if (error.code === "P2025") {
      return reply.status(404).send({ error: "Catégorie non trouvée." });
    }
    reply.status(500).send({
      error: "Erreur lors de la suppression.",
      details: error.message,
    });
  }
}
