import { FastifyRequest, FastifyReply } from "fastify";

// Début du typage
type GetByIdRequest = FastifyRequest<{ Params: { id: string } }>;
// Fin du typage

// Controlleurs
export async function getAllRegions(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const regions = await request.server.prisma.region.findMany();
    reply.send(regions);
  } catch (error) {
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

    if (!region) {
      return reply.status(404).send({ error: "Région introuvable" });
    }

    reply.send(region);
  } catch (error) {
    console.error("Erreur lors de la récupération de la région :", error);
    reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}
