import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage
type GetByIdRequest = FastifyRequest<{ Params: { id: string } }>;

type CreateBookRequest = FastifyRequest<{
  Body: {
    title: string;
    author?: string;
    summary?: string;
    imageUrl?: string;
    content: string;
  };
}>;

type UpdateBookRequest = FastifyRequest<{
  Params: { id: string };
  Body: {
    title: string;
    author?: string;
    summary?: string;
    imageUrl?: string;
    content: string;
  };
}>;
// Fin du typage

export async function getAllBooks(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const books = await request.server.prisma.book.findMany();
    reply.send(books);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des livres :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

export async function getBookById(
  request: GetByIdRequest,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ error: "ID invalide" });
    }

    const book = await request.server.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return reply.status(404).send({ error: "Livre introuvable" });
    }

    reply.status(200).send(book);
  } catch (error: any) {
    console.error("Erreur lors de la récupération du livre :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

export async function createBook(
  request: CreateBookRequest,
  reply: FastifyReply
) {
  try {
    const { title, author, summary, imageUrl, content } = request.body;

    if (!title || !content) {
      return reply.status(400).send({ error: "Titre et contenu requis" });
    }

    const newBook = await request.server.prisma.book.create({
      data: {
        title,
        author,
        summary,
        imageUrl,
        content,
      },
    });

    reply.status(201).send(newBook);
  } catch (error: any) {
    console.error("Erreur lors de la création du livre :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

export async function updateBook(
  request: UpdateBookRequest,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ error: "ID invalide" });
    }

    const { title, author, summary, imageUrl, content } = request.body;

    if (!title || !content) {
      return reply.status(400).send({ error: "Titre et contenu requis" });
    }

    const updatedBook = await request.server.prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        summary,
        imageUrl,
        content,
      },
    });

    reply.status(200).send(updatedBook);
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du livre :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

export async function deleteBook(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ error: "ID invalide" });
    }

    const book = await request.server.prisma.book.delete({
      where: { id },
    });

    reply.status(200).send(book);
  } catch (error: any) {
    console.error("Erreur lors de la suppression du livre :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}
