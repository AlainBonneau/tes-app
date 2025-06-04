import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage
type GetByIdRequest = FastifyRequest<{ Params: { id: string } }>;

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

export async function getCharacterById(
  request: GetByIdRequest,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id, 10);
    const character = await request.server.prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return reply.status(404).send({ error: "Charactère introuvable" });
    }

    reply.send(character);
  } catch (error: any) {
    console.error("Erreur lors de la récupération du charactère :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}
