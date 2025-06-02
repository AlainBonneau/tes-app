import Fastify from "fastify";
import dotenv from "dotenv";
import prismaPlugin from "./plugins/prisma";
import creatureRoutes from "./routes/creatures";

dotenv.config();

const app = Fastify({ logger: true });
const port = Number(process.env.PORT) || 3001;

app.get("/", async (request, reply) => {
  console.log("Welcome to the TES API");
  return { message: "Bienvenue sur l’API TES !" };
});

app.register(prismaPlugin);

// Route pour les créatures
app.register(creatureRoutes);

// 3. Démarrage
app.listen({ port }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Serveur lancé sur ${address}`);
});
