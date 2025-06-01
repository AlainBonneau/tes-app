import { FastifyInstance } from "fastify";
import {
  getAllCreatures,
  getCreatureById,
} from "../controllers/creaturesController";

export default async function creatureRoutes(app: FastifyInstance) {
  app.get("/creatures", getAllCreatures);
  app.get<{ Params: { id: string } }>("/creatures/:id", getCreatureById);
}
