import { FastifyInstance } from "fastify";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/booksController";

export default async function bookRoutes(app: FastifyInstance) {
  app.get("/books", getAllBooks);
  app.get<{ Params: { id: string } }>("/books/:id", getBookById);
  app.post<{
    Body: {
      title: string;
      author?: string;
      summary?: string;
      imageUrl?: string;
      content: string;
    };
  }>(
    "/books",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    createBook
  );
  app.patch<{
    Params: { id: string };
    Body: {
      title: string;
      author?: string;
      summary?: string;
      imageUrl?: string;
      content: string;
    };
  }>(
    "/books/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    updateBook
  );
  app.delete<{ Params: { id: string } }>(
    "/books/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    deleteBook
  );
}
