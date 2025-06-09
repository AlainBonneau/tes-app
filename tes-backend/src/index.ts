import Fastify from "fastify";
import dotenv from "dotenv";
import prismaPlugin from "./plugins/prisma";
import authPlugin from "./plugins/auth";
import userRoutes from "./routes/users";
import creatureRoutes from "./routes/creatures";
import regionRoutes from "./routes/region";
import raceRoutes from "./routes/race";
import characterRoutes from "./routes/character";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";
import fastifyJwt from "@fastify/jwt";

dotenv.config();

const app = Fastify({ logger: true });
const port = Number(process.env.PORT) || 3001;

app.get("/", async (request, reply) => {
  console.log("Welcome to the TES API");
  return { message: "Bienvenue sur l’API TES !" };
});

app.register(prismaPlugin);

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "changez-moi-en-production",
});

// Middleware d'authentification + Autorisation administrateur
app.register(authPlugin);

app.setErrorHandler((error, request, reply) => {
  const status = (error.statusCode as number) || 500;
  const err = error.name || "Error";
  const message = error.message || "Une erreur est survenue";

  reply.status(status).send({
    statusCode: status,
    error: err,
    message,
  });
});

// Nos routes
app.register(userRoutes);
app.register(creatureRoutes);
app.register(regionRoutes);
app.register(raceRoutes);
app.register(characterRoutes);
app.register(postRoutes);
app.register(commentRoutes);

// Démarrage
app.listen({ port }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Serveur lancé sur ${address}`);
});
