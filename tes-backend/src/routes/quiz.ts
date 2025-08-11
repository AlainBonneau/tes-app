import { FastifyInstance } from "fastify";
import {
  createQuiz,
  getQuizBySlug,
  leaderboard,
  listQuizzes,
  submitAttempt,
} from "../controllers/quizController";

export default async function quizRoutes(app: FastifyInstance) {
  app.get("/quizzes", listQuizzes);
  app.get("/quizzes/:slug", getQuizBySlug);

  app.post(
    "/quizzes",
    { preHandler: [app.authenticate, app.authorizeAdmin] as any },
    createQuiz
  );

  app.post("/quizzes/:slug/attempt", submitAttempt);
  app.get("/quizzes/leaderboard", leaderboard);
}
