import { FastifyRequest, FastifyReply } from "fastify";
import slugify from "slugify";

// Types
type GetByIdPostRequest = FastifyRequest<{ Params: { id: string } }>;
type GetPostBySlugRequest = FastifyRequest<{ Params: { slug: string } }>;

type CreatedPostRequest = FastifyRequest<{
  Body: {
    title: string;
    content: string;
    categoryId: number;
    pinned?: boolean;
    locked?: boolean;
    slug?: string;
  };
}>;

type UpdatedPostRequest = FastifyRequest<{
  Params: { id: string };
  Body: Partial<{
    title: string;
    content: string;
    categoryId: number;
    pinned: boolean;
    locked: boolean;
    slug: string;
  }>;
}>;

// Contrôleurs pour avoir les posts
export async function getAllPosts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { categorySlug, categoryId } = request.query as {
      categorySlug?: string;
      categoryId?: string;
    };
    let where: any = {};
    if (categorySlug) {
      where.category = { slug: categorySlug };
    } else if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    const posts = await request.server.prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, username: true, imageUrl: true } },
        category: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const postsWithSummary = posts.map((post) => ({
      ...post,
      summary:
        post.content.slice(0, 150) + (post.content.length > 150 ? "..." : ""),
    }));

    reply.send(postsWithSummary);
  } catch (error: any) {
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

// Controller pour obtenir un post par ID
export async function getPostById(
  request: GetByIdPostRequest,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id, 10);
    const post = await request.server.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, imageUrl: true } },
        _count: { select: { comments: true } },
        category: { select: { id: true, name: true } },
        comments: {
          include: {
            author: { select: { id: true, username: true, imageUrl: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post) {
      return reply.status(404).send({ error: "Poste non trouvé" });
    }

    // Incrémente le compteur de vues (async, non bloquant)
    request.server.prisma.post
      .update({
        where: { id },
        data: { views: { increment: 1 } },
      })
      .catch(() => {});

    reply.send(post);
  } catch (error: any) {
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

// Controller pour obtenir un post par slug
export async function getPostBySlug(
  request: GetPostBySlugRequest,
  reply: FastifyReply
) {
  try {
    const slug = request.params.slug;
    if (!slug) {
      return reply.status(400).send({ error: "Slug manquant." });
    }

    const post = await request.server.prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, username: true, imageUrl: true } },
        _count: { select: { comments: true } },
        category: { select: { id: true, name: true } },
        comments: {
          include: {
            author: { select: { id: true, username: true, imageUrl: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post) {
      return reply.status(404).send({ error: "Post non trouvé." });
    }

    request.server.prisma.post
      .update({
        where: { slug },
        data: { views: { increment: 1 } },
      })
      .catch(() => {});

    reply.send(post);
  } catch (error: any) {
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

// Controller pour créer un post
export async function createPost(
  request: CreatedPostRequest,
  reply: FastifyReply
) {
  const { title, content, categoryId, pinned, locked, slug } = request.body;
  if (!title || !content || !categoryId) {
    return reply
      .status(400)
      .send({ error: "title, content et categoryId requis" });
  }

  const payload = (request as any).user as { id: number };

  try {
    const slugSafe = slug ?? slugify(title, { lower: true, strict: true });

    const post = await request.server.prisma.post.create({
      data: {
        title,
        content,
        categoryId,
        pinned: pinned ?? false,
        locked: locked ?? false,
        authorId: payload.id,
        slug: slugSafe,
      },
    });

    return reply.status(201).send(post);
  } catch (error: any) {
    // Gestion violation unique (ex: slug déjà utilisé)
    if (error.code === "P2002") {
      return reply.status(409).send({ error: "Slug déjà utilisé" });
    }
    return reply
      .status(500)
      .send({ error: "Impossible de créer le poste.", details: error.message });
  }
}

// Controller pour mettre à jour un post
export async function updatePost(
  request: UpdatedPostRequest,
  reply: FastifyReply
) {
  const postId = parseInt(request.params.id, 10);
  const payload = (request as any).user as { id: number; role: string };

  const existingPost = await request.server.prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!existingPost) {
    return reply.status(404).send({ error: "Poste non trouvé" });
  }
  if (existingPost.authorId !== payload.id && payload.role !== "admin") {
    return reply.status(403).send({ error: "Non autorisé" });
  }

  const { title, content, categoryId, pinned, locked, slug } = request.body;
  const data: Record<string, any> = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;
  if (categoryId !== undefined) data.categoryId = categoryId;
  if (pinned !== undefined) data.pinned = pinned;
  if (locked !== undefined) data.locked = locked;
  if (slug !== undefined) data.slug = slug;
  data.lastEdit = new Date();

  try {
    const updatedPost = await request.server.prisma.post.update({
      where: { id: postId },
      data,
    });

    reply.send(updatedPost);
  } catch (error: any) {
    if (error.code === "P2002") {
      return reply.status(409).send({ error: "Slug déjà utilisé" });
    }
    return reply.status(500).send({
      error: "Impossible de mettre à jour le poste.",
      details: error.message,
    });
  }
}

// Controller pour supprimer un post
export async function deletePost(
  request: GetByIdPostRequest,
  reply: FastifyReply
) {
  const postId = parseInt(request.params.id, 10);
  const payload = (request as any).user as { id: number; role: string };

  const existingPost = await request.server.prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!existingPost) {
    return reply.status(404).send({ error: "Poste non trouvé" });
  }
  if (existingPost.authorId !== payload.id && payload.role !== "admin") {
    return reply.status(403).send({ error: "Non autorisé" });
  }

  try {
    await request.server.prisma.post.delete({ where: { id: postId } });
    reply.status(204).send();
  } catch (error: any) {
    reply.status(404).send({ error: "Poste non trouvé." });
  }
}
