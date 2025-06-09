import { FastifyInstance } from "fastify";
import {
  getAllCommentsForPost,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentsController";

export default async function commentRoutes(app: FastifyInstance) {
  app.get<{ Params: { postId: string } }>(
    "/posts/:postId/comments",
    getAllCommentsForPost
  );

  app.post<{ Params: { postId: string }; Body: { content: string } }>(
    "/posts/:postId/comments",
    { preHandler: [app.authenticate] },
    createComment
  );

  app.patch<{ Params: { id: string }; Body: { content: string } }>(
    "/comments/:id",
    { preHandler: [app.authenticate] },
    updateComment
  );

  app.delete<{ Params: { id: string } }>(
    "/comments/:id",
    { preHandler: [app.authenticate] },
    deleteComment
  );
}
