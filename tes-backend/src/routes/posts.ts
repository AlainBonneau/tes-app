import { FastifyInstance } from "fastify";
import { zodValidate } from "../middlewares/zodValidate";
import { CreatePostSchema, UpdatePostSchema } from "../schemas/postSchema";
import {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postsController";

export default async function postRoutes(app: FastifyInstance) {
  app.get("/posts", getAllPosts);
  app.get<{ Params: { id: string } }>("/posts/:id", getPostById);
  app.get<{ Params: { slug: string } }>("/posts/slug/:slug", getPostBySlug);
  app.post<{
    Body: {
      title: string;
      content: string;
      categoryId: number;
      pinned?: boolean;
      locked?: boolean;
      slug?: string;
    };
  }>(
    "/posts",
    { preHandler: [app.authenticate, zodValidate(CreatePostSchema)] },
    createPost
  );

  app.patch<{
    Params: { id: string };
    Body: Partial<{
      title: string;
      content: string;
      categoryId: number;
      pinned: boolean;
      locked: boolean;
      slug: string;
    }>;
  }>(
    "/posts/:id",
    { preHandler: [app.authenticate, zodValidate(UpdatePostSchema)] },
    updatePost
  );

  app.delete<{ Params: { id: string } }>(
    "/posts/:id",
    { preHandler: [app.authenticate] },
    deletePost
  );
}
