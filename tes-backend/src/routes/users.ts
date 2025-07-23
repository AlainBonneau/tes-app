import { FastifyInstance } from "fastify";
import { zodValidate } from "../middlewares/zodValidate";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/userSchema";
import {
  getAllUsers,
  getCurrentUser,
  registerUser,
  loginUser,
  updateUser,
  updateUserById,
  logoutUser,
  deleteAllUserContent,
  deleteUser,
} from "../controllers/usersController";

export default async function userRoutes(app: FastifyInstance) {
  app.get(
    "/users",
    {
      preHandler: [
        app.authenticate,
        app.authorizeModerator,
        app.authorizeAdmin,
      ],
    },
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
  }>(
    "/users/register",
    { preHandler: [zodValidate(CreateUserSchema)] },
    registerUser
  );
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
  }>(
    "/users/me",
    { preHandler: [app.authenticate, zodValidate(UpdateUserSchema)] },
    updateUser
  );
  app.put<{
    Params: { id: string };
    Body: {
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
      description?: string;
      birthdate?: Date;
      role?: string;
    };
  }>(
    "/users/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    updateUserById
  );
  app.post("/users/logout", { preHandler: [app.authenticate] }, logoutUser);
  app.delete<{
    Params: { id: string };
  }>(
    "/users/:id/content",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    deleteAllUserContent
  );

  app.delete<{
    Params: { id: string };
  }>(
    "/users/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    deleteUser
  );
}
