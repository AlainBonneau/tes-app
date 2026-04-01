import { ZodType } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

export function zodValidate(schema: ZodType) {
  return (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      reply.status(400).send({
        error: "Données invalides",
        details: result.error.issues,
      });
      return;
    }
    request.body = result.data;
    done();
  };
}
