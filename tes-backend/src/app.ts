// src/app.ts
import Fastify from "fastify";
import dotenv from "dotenv";
import rateLimit from "@fastify/rate-limit";
import prismaPlugin from "./plugins/prisma";
import authPlugin from "./plugins/auth";
import userRoutes from "./routes/users";
import creatureRoutes from "./routes/creatures";
import regionRoutes from "./routes/region";
import raceRoutes from "./routes/race";
import characterRoutes from "./routes/character";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";
import fastifyJwt from "@fastify/jwt";

dotenv.config();

export async function buildApp() {
  const app = Fastify({ logger: false });

  // 1) Plugins fondamentaux
  app.register(prismaPlugin);
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "test-secret",
  });
  app.register(authPlugin);
  app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

  // 2) Gestion centralisée des erreurs
  app.setErrorHandler((error, request, reply) => {
    const status = (error.statusCode as number) || 500;
    const err = error.name || "Error";
    const msg = error.message || "Une erreur est survenue";
    reply.status(status).send({ statusCode: status, error: err, message: msg });
  });

  // 3) Routes
  app.get("/", async () => ({ message: "Bienvenue sur l’API TES !" }));
  app.register(userRoutes);
  app.register(creatureRoutes);
  app.register(regionRoutes);
  app.register(raceRoutes);
  app.register(characterRoutes);
  app.register(postRoutes);
  app.register(commentRoutes);

  return app;
}
