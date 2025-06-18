import { FastifyInstance } from "fastify";
import {
  getAllCreatures,
  getCreatureById,
  createCreature,
  updateCreature,
  deleteCreature,
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
  }>(
    "/creatures",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    createCreature
  );
  app.patch<{
    Params: { id: string };
    Body: {
      name: string;
      type: string;
      description: string;
      regionId?: number;
      imageUrl?: string;
    };
  }>(
    "/creatures/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    updateCreature
  );
  app.delete<{ Params: { id: string } }>(
    "/creatures/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    deleteCreature
  );
}
