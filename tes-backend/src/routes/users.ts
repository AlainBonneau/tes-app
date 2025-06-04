import { FastifyInstance } from "fastify";
import { registerUser, loginUser } from "../controllers/usersController";

export default async function userRoutes(app: FastifyInstance) {
  app.post<{
    Body: { email: string; username: string; password: string };
  }>("/users.register", registerUser);
  app.post<{
    Body: { email: string; password: string };
  }>("/users/login", loginUser);
}
