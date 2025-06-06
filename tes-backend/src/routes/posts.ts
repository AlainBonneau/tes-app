import { FastifyInstance } from "fastify";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postsController";

export default async function postRoutes(app: FastifyInstance) {
  app.get("/posts", getAllPosts);
  app.get<{ Params: { id: string } }>("/posts/:id", getPostById);
  app.post<{ Body: { title: string; content: string } }>(
    "/posts",
    { preHandler: [app.authenticate] },
    createPost
  );
  app.patch<{
    Params: { id: string };
    Body: Partial<{ title: string; content: string }>;
  }>("/posts/:id", { preHandler: [app.authenticate] }, updatePost);
  app.delete<{ Params: { id: string } }>(
    "/posts/:id",
    { preHandler: [app.authenticate] },
    deletePost
  );
}
