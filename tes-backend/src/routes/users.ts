import { FastifyInstance } from "fastify";
import {
  getAllUsers,
  getCurrentUser,
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
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
  app.put<{
    Body: {
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
      description?: string;
      birthdate?: Date;
    };
  }>("/users/me", { preHandler: [app.authenticate] }, updateUser);
  app.post("/users/logout", { preHandler: [app.authenticate] }, logoutUser);
}
