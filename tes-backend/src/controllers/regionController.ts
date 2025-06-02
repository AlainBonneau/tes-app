import { FastifyRequest, FastifyReply } from "fastify";

export default async function getAllRegions(
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
