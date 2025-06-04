import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage
type GetByIdRequest = FastifyRequest<{ Params: { id: string } }>;

type CreateCharacterRequest = FastifyRequest<{
  Body: {
    name: string;
    description: string;
    imageUrl?: string;
    regionId: number;
    raceId: number;
  };
}>;

type UpdateCharacterRequest = FastifyRequest<{
  Params: { id: string };
  Body: {
    name: string;
    description: string;
    imageUrl?: string;
    regionId: number;
    raceId: number;
  };
}>;

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

    if (isNaN(id)) {
      return reply.status(400).send({ error: "ID invalide" });
    }

    if (!character) {
      return reply.status(404).send({ error: "Charactère introuvable" });
    }

    reply.send(character);
  } catch (error: any) {
    console.error("Erreur lors de la récupération du charactère :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

export async function createCharacter(
  request: CreateCharacterRequest,
  reply: FastifyReply
) {
  const { name, description, imageUrl, regionId, raceId } = request.body;

  if (!name || !description || !regionId || !raceId) {
    return reply.status(400).send({
      error:
        "Les champs name, description, regionId et raceId sont obligatoires",
    });
  }

  try {
    const character = await request.server.prisma.character.create({
      data: {
        name,
        description,
        imageUrl: imageUrl || null,
        region: {
          connect: { id: regionId },
        },
        race: {
          connect: { id: raceId },
        },
      },
    });

    return reply.status(201).send(character);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Impossible de créer le personnage.",
      details: error.message,
    });
  }
}

export async function updateCharacter(
  request: UpdateCharacterRequest,
  reply: FastifyReply
) {
  const id = parseInt(request.params.id, 10);
  const { name, description, imageUrl, regionId, raceId } = request.body;

  if (isNaN(id)) {
    return reply.status(400).send({ error: "ID invalide" });
  }

  try {
    const data: any = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (regionId) data.region = { connect: { id: regionId } };
    if (raceId) data.race = { connect: { id: raceId } };

    const updatedCharacter = await request.server.prisma.character.update({
      where: { id },
      data,
    });

    return reply.status(200).send(updatedCharacter);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Impossible de mettre à jour le charactère.",
      details: error.message,
    });
  }
}

export async function deleteCharacter(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    return reply.status(400).send({ error: "ID invalide" });
  }

  try {
    await request.server.prisma.character.delete({ where: { id } });
    return reply.status(204).send();
  } catch (error: any) {
    return reply.status(404).send({ error: "Charactère non trouvée." });
  }
}
