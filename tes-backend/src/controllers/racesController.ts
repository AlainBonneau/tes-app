import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage
type GetByIdRequest = FastifyRequest<{ Params: { id: string } }>;

type CreateRaceRequest = FastifyRequest<{
  Body: {
    name: string;
    faction: string;
    description: string;
  };
}>;

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

export async function getRaceById(
  request: GetByIdRequest,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id, 10);
    const race = await request.server.prisma.race.findUnique({ where: { id } });

    if (!race) {
      return reply.status(404).send({ error: "Race introuvable" });
    }

    reply.send(race);
  } catch (error) {
    console.error("Erreur lors de la récupération de la race :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}
