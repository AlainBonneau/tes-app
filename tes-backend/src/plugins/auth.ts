import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { JwtUserPayload } from "../types/auth";

async function extractToken(request: FastifyRequest) {
  // 1. Cookie (Front)
  if (request.cookies && request.cookies.token) {
    return request.cookies.token;
  }
  // 2. Header (Supertest / Postman)
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export default fp(async (app: FastifyInstance) => {
  // Middleware pour vérifier le JWT (utilisateur authentifié)
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = await extractToken(request);
      if (!token) {
        return reply.status(401).send({ error: "Token manquant" });
      }
      try {
        const payload = await request.server.jwt.verify(token);
        // On attache le user au request pour la suite (comme jwtVerify le ferait)
        (request as any).user = payload;
      } catch {
        return reply.status(401).send({ error: "Token invalide" });
      }
    }
  );

  // Middleware pour vérifier que l'utilisateur est admin
  app.decorate(
    "authorizeAdmin",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = await extractToken(request);
      if (!token) {
        return reply.status(401).send({ error: "Token manquant" });
      }
      try {
        const payload = (await request.server.jwt.verify(
          token
        )) as JwtUserPayload;
        (request as any).user = payload;
        if (payload.role !== "admin") {
          return reply
            .status(403)
            .send({ error: "Accès réservé aux administrateurs" });
        }
      } catch {
        return reply.status(401).send({ error: "Token invalide" });
      }
    }
  );
});
