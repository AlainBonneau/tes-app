import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage

// Fin du typage

export async function getAllCharacters(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const characters = await request.server.prisma.character.findMany();
    reply.send(characters);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des charactères :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}
