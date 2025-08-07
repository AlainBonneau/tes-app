import { FastifyInstance } from "fastify";
import {
  forgetPassword,
  resetPassword,
} from "../controllers/passwordController";

export default async function passwordRoutes(app: FastifyInstance) {
  app.post<{ Body: { email: string } }>("/forget-password", forgetPassword);
  app.post<{ Body: { email: string; token: string; newPassword: string } }>(
    "/reset-password",
    resetPassword
  );
}
