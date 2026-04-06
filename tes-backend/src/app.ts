import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import jwt from "@fastify/jwt";
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
import categoryRoutes from "./routes/category";
import bookRoutes from "./routes/books";
import uploadRoutes from "./routes/upload";
import passwordRoutes from "./routes/password";
import quizRoutes from "./routes/quiz";

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export async function buildApp() {
  const app = Fastify({ logger: true });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const jwtSecret = getRequiredEnv("JWT_SECRET");

  app.register(cors, {
    origin: [frontendUrl],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  app.register(cookie, {
    secret: process.env.SIGNED_COOKIE,
  });

  app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: () => ({
      error: "Trop de requêtes, merci de patienter.",
    }),
  });

  app.register(prismaPlugin);

  app.register(jwt, {
    secret: jwtSecret,
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  app.register(authPlugin);

  app.setErrorHandler((error, request, reply) => {
    const e: FastifyLikeError = isFastifyLikeError(error) ? error : {};

    if (
      e.statusCode === 429 ||
      e.code === "FST_ERR_RATE_LIMIT" ||
      e.error === "Trop de requêtes, merci de patienter."
    ) {
      return reply
        .status(429)
        .send({ error: "Trop de requêtes, merci de patienter." });
    }

    const status = e.statusCode ?? 500;

    return reply.status(status).send({
      statusCode: status,
      error: e.name ?? "Error",
      message: e.message ?? "Une erreur est survenue",
    });
  });

  app.get("/", async () => ({ message: "Bienvenue sur l’API TES !" }));

  app.register(multipart, {
    limits: { fileSize: 10 * 1024 * 1024 },
  });

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
  app.register(passwordRoutes);
  app.register(quizRoutes);

  return app;
}

type FastifyLikeError = {
  statusCode?: number;
  code?: string;
  name?: string;
  message?: string;
  error?: string;
};

const isFastifyLikeError = (e: unknown): e is FastifyLikeError =>
  typeof e === "object" && e !== null;
