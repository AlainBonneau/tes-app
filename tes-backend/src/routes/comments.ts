import { FastifyInstance } from "fastify";
import { zodValidate } from "../middlewares/zodValidate";
import { CommentSchema, UpdateCommentShcema } from "../schemas/commentSchema";
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
    { preHandler: [app.authenticate, zodValidate(CommentSchema)] },
    createComment
  );

  app.patch<{ Params: { id: string }; Body: { content: string } }>(
    "/comments/:id",
    { preHandler: [app.authenticate, zodValidate(UpdateCommentShcema)] },
    updateComment
  );

  app.delete<{ Params: { id: string } }>(
    "/comments/:id",
    { preHandler: [app.authenticate] },
    deleteComment
  );
}
