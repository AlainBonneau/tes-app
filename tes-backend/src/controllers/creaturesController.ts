// src/controllers/creaturesController.ts
import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage
type GetByIdRequest = FastifyRequest<{ Params: { id: string } }>;
type CreateCreatureRequest = FastifyRequest<{
  Body: {
    name: string;
    type: string;
    description: string;
    regionId?: number;
    imageUrl?: string;
  };
}>;
// Fin du typage

// Controlleurs

export async function getAllCreatures(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const creatures = await request.server.prisma.creature.findMany();
  reply.send(creatures);
}

export async function getCreatureById(
  request: GetByIdRequest,
  reply: FastifyReply
) {
  const id = parseInt(request.params.id, 10);
  const creature = await request.server.prisma.creature.findUnique({
    where: { id },
  });

  if (!creature) {
    return reply.status(404).send({ error: "Créature introuvable" });
  }
  reply.send(creature);
}

export async function createCreature(
  request: CreateCreatureRequest,
  reply: FastifyReply
) {
  const { name, type, description, regionId, imageUrl } = request.body;

  if (!name || !type || !description) {
    return reply.status(400).send({
      error: "Les champs name, type et description sont obligatoires.",
    });
  }

  try {
    const data: {
      name: string;
      type: string;
      description: string;
      imageUrl?: string | null;
      region?: { connect: { id: number } };
    } = {
      name,
      type,
      description,
    };

    if (imageUrl) data.imageUrl = imageUrl;
    if (regionId !== undefined) data.region = { connect: { id: regionId } };

    const newCreature = await request.server.prisma.creature.create({ data });
    return reply.status(201).send(newCreature);
  } catch (err: any) {
    return reply.status(500).send({
      error: "Impossible de créer la créature.",
      details: err.message,
    });
  }
}
