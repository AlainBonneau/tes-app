import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage
type GetByIdRequest = FastifyRequest<{ Params: { id: string } }>;

type CreateRaceRequest = FastifyRequest<{
  Body: {
    name: string;
    origine: string;
    description: string;
  };
}>;

type UpdateRaceRequest = FastifyRequest<{
  Params: { id: string };
  Body: {
    name: string;
    origine: string;
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

    if (isNaN(id)) {
      return reply.status(400).send({ error: "ID invalide" });
    }

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
  const { name, origine, description } = request.body;

  if (!name || !origine || !description) {
    return reply.status(400).send({
      error: "Les champs name, origine et description sont obligatoires",
    });
  }

  try {
    const data: {
      name: string;
      origine: string;
      description: string;
    } = {
      name,
      origine,
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

export async function updateRace(
  request: UpdateRaceRequest,
  reply: FastifyReply
) {
  const id = parseInt(request.params.id, 10);
  const { name, origine, description } = request.body;

  if (isNaN(id)) {
    return reply.status(400).send({ error: "ID invalide" });
  }

  try {
    const data: any = {};
    if (name) data.name = name;
    if (origine) data.origine = origine;
    if (description) data.description = description;

    const updateRace = await request.server.prisma.race.update({
      where: { id },
      data,
    });

    return reply.status(200).send(updateRace);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Impossible de mettre à jour la race",
      details: error.message,
    });
  }
}

export async function deleteRace(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    return reply.status(400).send({ error: "ID invalide" });
  }
  try {
    await request.server.prisma.race.delete({ where: { id } });
    return reply.status(204).send();
  } catch (error: any) {
    return reply.status(404).send({ error: "Race non trouvée." });
  }
}
