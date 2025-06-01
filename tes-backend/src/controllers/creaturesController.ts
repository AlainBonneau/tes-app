import { FastifyRequest, FastifyReply } from "fastify";

type GetByIdRequest = FastifyRequest<{ Params: { id: string } }>;

// Retourne TOUTES les créatures
export async function getAllCreatures(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const creatures = await request.server.prisma.creature.findMany();
  reply.send(creatures);
}

// Retourne une seule créature via son ID
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
