import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage

// Fin du typage

export async function getAllRaces(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const races = await request.server.prisma.race.findMany();
    reply.send(races);
  } catch (error) {
    console.error("Erreur lors de la récupératino des races", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}
