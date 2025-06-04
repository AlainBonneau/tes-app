import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default fp(async (app: FastifyInstance) => {
  // Middleware pour vérifier le JWT (utilisateur authentifié)
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.status(401).send({ error: "Token invalide" });
      }
    }
  );

  // Middleware pour vérifier que l'utilisateur est admin
  app.decorate(
    "authorizeAdmin",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        // @ts-ignore
        const payload = request.user as { role: string };
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
