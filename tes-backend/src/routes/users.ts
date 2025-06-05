import { FastifyInstance } from "fastify";
import {
  getAllUsers,
  getCurrentUser,
  registerUser,
  loginUser,
} from "../controllers/usersController";

export default async function userRoutes(app: FastifyInstance) {
  app.get(
    "/users",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    getAllUsers
  );
  app.get("/users/me", { preHandler: [app.authenticate] }, getCurrentUser);
  app.post<{
    Body: {
      email: string;
      username: string;
      password: string;
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
      description?: string;
      birthdate?: Date;
      role?: string;
    };
  }>("/users/register", registerUser);
  app.post<{
    Body: { email: string; password: string };
  }>("/users/login", loginUser);
}
