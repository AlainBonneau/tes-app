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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error("Erreur lors de la récupération de la race :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

export async function createRace(
  request: CreateRaceRequest,
  reply: FastifyReply
) {
  const { name, faction, description } = request.body;

  if (!name || !faction || !description) {
    return reply.status(400).send({
      error: "Les champs name, factino et description sont obligatoires",
    });
  }

  try {
    const data: {
      name: string;
      faction: string;
      description: string;
    } = {
      name,
      faction,
      description,
    };

    const newRace = await request.server.prisma.race.create({ data });
    return reply.status(201).send(newRace);
  } catch (error: any) {
    return reply
      .status(500)
      .send({ error: "Impossible créer la race", details: error.message });
  }
}
