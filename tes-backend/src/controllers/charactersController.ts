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
