import Fastify from "fastify";
import "dotenv/config";

const app = Fastify({ logger: true });
const port: number = Number(process.env.PORT);

app.get("/", async (request, reply) => {
  return { message: "Elder Scrolls API is online!" };
});

app.listen({ port }, (err, adress) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Serveur lancé : ${adress}`);
});
