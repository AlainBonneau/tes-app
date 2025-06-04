import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage
type GetByIdRequest = FastifyRequest<{ Params: { id: string } }>;

type CreateRegionRequest = FastifyRequest<{
  Body: {
    name: string;
    description: string;
    imageUrl?: string;
  };
}>;

type UpdateRegionRequest = FastifyRequest<{
  Params: { id: string };
  Body: {
    name: string;
    description: string;
    imageUrl?: string;
  };
}>;
// Fin du typage

// Controlleurs
export async function getAllRegions(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const regions = await request.server.prisma.region.findMany();
    reply.send(regions);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des régions :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

export async function getRegionById(
  request: GetByIdRequest,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id, 10);
    const region = await request.server.prisma.region.findUnique({
      where: { id },
    });

    if (isNaN(id)) {
      return reply.status(400).send({ error: "ID invalide" });
    }

    if (!region) {
      return reply.status(404).send({ error: "Région introuvable" });
    }

    reply.send(region);
  } catch (error: any) {
    console.error("Erreur lors de la récupération de la région :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

export async function createRegion(
  request: CreateRegionRequest,
  reply: FastifyReply
) {
  const { name, description, imageUrl } = request.body;

  if (!name || !description) {
    return reply
      .status(400)
      .send({ error: "Les champs name et description sont obligatoires" });
  }

  try {
    const data: {
      name: string;
      description: string;
      imageUrl?: string | null;
    } = {
      name,
      description,
    };

    if (imageUrl) data.imageUrl = imageUrl;

    const newRegion = await request.server.prisma.region.create({ data });
    return reply.status(201).send(newRegion);
  } catch (error: any) {
    return reply
      .status(500)
      .send({ error: "Impossible créer la région", details: error.message });
  }
}

export async function updateRegion(
  request: UpdateRegionRequest,
  reply: FastifyReply
) {
  const id = Number(request.params.id);
  const { name, description, imageUrl } = request.body;

  if (isNaN(id)) {
    return reply.status(400).send({ error: "ID invalide" });
  }

  try {
    const data: any = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;

    const updateRegion = await request.server.prisma.region.update({
      where: { id },
      data,
    });

    return reply.status(200).send(updateRegion);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Impossible de mettre à jour la région",
      details: error.message,
    });
  }
}

export async function deleteRegion(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    return reply.status(400).send({ error: "ID invalide" });
  }
  try {
    await request.server.prisma.region.delete({ where: { id } });
    return reply.status(204).send();
  } catch (error: any) {
    return reply.status(404).send({ error: "Région non trouvée." });
  }
}
