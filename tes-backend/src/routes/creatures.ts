import { FastifyInstance } from "fastify";
import {
  getAllCreatures,
  getCreatureById,
  createCreature,
} from "../controllers/creaturesController";

export default async function creatureRoutes(app: FastifyInstance) {
  app.get("/creatures", getAllCreatures);
  app.get<{ Params: { id: string } }>("/creatures/:id", getCreatureById);
  app.post<{
    Body: {
      name: string;
      type: string;
      description: string;
      regionId?: number;
      imageUrl?: string;
    };
  }>("/creatures", createCreature);
}
