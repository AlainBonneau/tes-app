// src/types/fastify-auth.d.ts
import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    /**
     * Middleware à ajouter dans preHandler pour valider le JWT.
     */
    authenticate(request: import("fastify").FastifyRequest, reply: import("fastify").FastifyReply): Promise<void>;

    /**
     * Middleware à ajouter dans preHandler pour valider JWT + rôle admin.
     */
    authorizeAdmin(request: import("fastify").FastifyRequest, reply: import("fastify").FastifyReply): Promise<void>;
  }
}
