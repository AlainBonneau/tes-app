import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";

export async function getAdminToken(app: FastifyInstance): Promise<string> {
  const prisma = app.prisma;
  const jwt = (app as any).jwt;

  let user = await prisma.user.findUnique({
    where: { email: "admin@test.com" },
  });

  if (!user) {
    const hashed = await bcrypt.hash("password", 10);
    user = await prisma.user.create({
      data: {
        email: "admin@test.com",
        username: "admin",
        password: hashed,
        role: "admin",
      },
    });
  }

  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });
}
