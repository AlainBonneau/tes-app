import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";

type RegisterRequest = FastifyRequest<{
  Body: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    description?: string;
    birthdate?: Date;
    role?: string;
  };
}>;

type LoginRequest = FastifyRequest<{
  Body: {
    email: string;
    password: string;
  };
}>;

type updateUserRequest = FastifyRequest<{
  Body: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    description?: string;
    birthdate?: Date;
  };
}>;

type updateUserRequestWithRole = FastifyRequest<{
  Body: {
    username?: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    description?: string;
    birthdate?: Date;
    role?: string;
  };
}>;

export async function getAllUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const users = await request.server.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        birthdate: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        description: true,
        role: true,
      },
    });
    reply.send(users);
  } catch (error: any) {
    reply.status(500).send({
      error: "Impossible de récupérer les utilisateurs.",
      details: error.message,
    });
  }
}

export async function getCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const payload = (request as any).user as {
      id: number;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      imageUrl: string;
      description: string;
      birthdate: Date;
      createdAt: Date;
      role: string;
    };

    const user = await request.server.prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        description: true,
        birthdate: true,
        createdAt: true,
        role: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ error: "Utilisateur non trouvé." });
    }

    return reply.status(200).send(user);
  } catch (err: any) {
    return reply.status(500).send({
      error: "Impossible de récupérer le profil.",
      details: err.message,
    });
  }
}

export async function registerUser(
  request: RegisterRequest,
  reply: FastifyReply
) {
  const {
    email,
    username,
    password,
    birthdate,
    firstName,
    lastName,
    description,
    imageUrl,
  } = request.body;

  if (!email || !username || !password) {
    return reply
      .status(400)
      .send({ error: "email, username et password requis" });
  }

  const existingUsername = await request.server.prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    return reply
      .status(409)
      .send({ error: "Ce nom d'utilisateur est déjà utilisé." });
  }
  const existingEmail = await request.server.prisma.user.findUnique({
    where: { email },
  });
  if (existingEmail) {
    return reply.status(409).send({ error: "Cet email est déjà utilisé." });
  }

  const hashed = await bcrypt.hash(password, 10);
  const data: any = {
    email,
    username,
    password: hashed,
    firstName,
    lastName,
    description,
    imageUrl,
  };
  if (birthdate) data.birthdate = new Date(birthdate);

  try {
    const newUser = await request.server.prisma.user.create({ data });
    const { password: _, ...userWithoutPassword } = newUser;
    reply.status(201).send(userWithoutPassword);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Impossible de créer l’utilisateur.",
      details: error.message,
    });
  }
}

export async function loginUser(request: LoginRequest, reply: FastifyReply) {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply.status(400).send({ error: "email et password requis" });
  }

  const user = await request.server.prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return reply.status(401).send({ error: "Identifiants invalides" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return reply.status(401).send({ error: "Identifiants invalides" });
  }

  const TOKEN_EXPIRATION = "24h";
  const token = await (request.server as any).jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      description: user.description,
      birthdate: user.birthdate,
      createdAt: user.createdAt,
      role: user.role,
    },
    { expiresIn: TOKEN_EXPIRATION }
  );

  reply
    .setCookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })
    .send({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        description: user.description,
        birthdate: user.birthdate,
        createdAt: user.createdAt,
        role: user.role,
      },
      token,
    });
}

export async function updateUser(
  request: updateUserRequest,
  reply: FastifyReply
) {
  const payload = (request as any).user as { id: number };

  const { firstName, lastName, imageUrl, description, birthdate } =
    request.body;

  try {
    const updatedUser = await request.server.prisma.user.update({
      where: { id: payload.id },
      data: {
        firstName,
        lastName,
        imageUrl,
        description,
        birthdate: birthdate ? new Date(birthdate) : undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        description: true,
        birthdate: true,
        createdAt: true,
        role: true,
      },
    });
    return reply.status(200).send(updatedUser);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Impossible de mettre à jour le profil.",
      details: error.message,
    });
  }
}

export async function updateUserById(
  request: updateUserRequestWithRole,
  reply: FastifyReply
) {
  const id = Number((request.params as { id: string | number }).id);
  if (isNaN(id)) {
    return reply.status(400).send({ error: "ID invalide" });
  }

  const payload = (request as any).user as { id: number; role: string };
  if (payload.role !== "admin") {
    return reply.status(403).send({ error: "Accès interdit" });
  }

  const {
    username,
    firstName,
    lastName,
    imageUrl,
    description,
    birthdate,
    role,
  } = request.body;

  try {
    const updatedUser = await request.server.prisma.user.update({
      where: { id },
      data: {
        username,
        firstName,
        lastName,
        imageUrl,
        description,
        birthdate: birthdate ? new Date(birthdate) : undefined,
        role,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        description: true,
        birthdate: true,
        createdAt: true,
        role: true,
      },
    });
    return reply.status(200).send(updatedUser);
  } catch (error: any) {
    return reply.status(500).send({
      error: "Impossible de mettre à jour l'utilisateur.",
      details: error.message,
    });
  }
}

export async function logoutUser(request: FastifyRequest, reply: FastifyReply) {
  reply
    .clearCookie("token", {
      path: "/",
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .send({ message: "Déconnexion réussie" });
}
