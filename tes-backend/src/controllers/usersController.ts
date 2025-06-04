import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { hash } from "crypto";

type RegisterRequest = FastifyRequest<{
  Body: { email: string; username: string; password: string };
}>;

type LoginRequest = FastifyRequest<{
  Body: { email: string; password: string };
}>;

export async function registerUser(
  request: RegisterRequest,
  reply: FastifyReply
) {
  const { email, username, password } = request.body;

  if (!email || !username || !password) {
    return reply
      .status(400)
      .send({ error: "email, username et password requis" });
  }

  const existingEmail = await request.server.prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    return reply.status(409).send({ error: "Cet email est déjà utilisé." });
  }

  const saltRound = 10;
  const hashed = await bcrypt.hash(password, saltRound);

  try {
    const newUser = await request.server.prisma.user.create({
      data: { email, username, password: hashed },
    });

    // On ne renvoie pas le hash dans la réponse
    const { password: _, ...userWithoutPassword } = newUser;
    reply.status(201).send(userWithoutPassword);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Impossible de créer l’utilisateur.",
      details: error.message,
    });
  }
}
