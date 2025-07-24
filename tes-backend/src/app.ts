// src/app.ts
import Fastify from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import prismaPlugin from "./plugins/prisma";
import authPlugin from "./plugins/auth";
import userRoutes from "./routes/users";
import creatureRoutes from "./routes/creatures";
import regionRoutes from "./routes/region";
import raceRoutes from "./routes/race";
import characterRoutes from "./routes/character";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";
import categoryRoutes from "./routes/category";
import bookRoutes from "./routes/books";
import uploadRoutes from "./routes/upload";
import fastifyJwt from "@fastify/jwt";

dotenv.config();

export async function buildApp() {
  const app = Fastify({ logger: false });

  // Configuration des cors
  app.register(cors, {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // Configuration de la limite de requêtes
  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: (req, context) => ({
      error: "Trop de requêtes, merci de patienter.",
    }),
  });
  // Configuration des cookies
  app.register(fastifyCookie, {
    secret: process.env.SIGNED_COOKIE, // for signed cookies (optional)
    parseOptions: {}, // options for parsing cookies
  });

  // 1) Plugins fondamentaux
  app.register(prismaPlugin);
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "test-secret",
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  app.register(authPlugin);
  app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

  // 2) Gestion centralisée des erreurs
  app.setErrorHandler((error, request, reply) => {
    if (
      (typeof error === "object" &&
        (error as any)?.error === "Trop de requêtes, merci de patienter.") ||
      error.statusCode === 429 ||
      error.code === "FST_ERR_RATE_LIMIT"
    ) {
      reply.status(429).send({
        error: "Trop de requêtes, merci de patienter.",
      });
      return;
    }

    const status = error.statusCode || 500;
    reply.status(status).send({
      statusCode: status,
      error: error.name || "Error",
      message: error.message || "Une erreur est survenue",
    });
  });

  // 3) Routes
  app.get("/", async () => ({ message: "Bienvenue sur l’API TES !" }));
  app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }); // Limite de 10 Mo pour les fichiers uploadés
  app.register(userRoutes);
  app.register(creatureRoutes);
  app.register(regionRoutes);
  app.register(raceRoutes);
  app.register(characterRoutes);
  app.register(postRoutes);
  app.register(commentRoutes);
  app.register(categoryRoutes);
  app.register(bookRoutes);
  app.register(uploadRoutes);

  return app;
}
