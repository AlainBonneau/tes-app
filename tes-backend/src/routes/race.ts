import { FastifyInstance } from "fastify";
import {
  getAllRaces,
  getRaceById,
  createRace,
  updateRace,
  deleteRace,
} from "../controllers/racesController";

export default async function raceRoutes(app: FastifyInstance) {
  app.get("/races", getAllRaces);
  app.get<{ Params: { id: string } }>("/races/:id", getRaceById);
  app.post<{
    Body: {
      name: string;
      origine: string;
      description: string;
    };
  }>(
    "/races",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    createRace
  );
  app.patch<{
    Params: { id: string };
    Body: {
      name: string;
      origine: string;
      description: string;
    };
  }>(
    "/races/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    updateRace
  );
  app.delete<{ Params: { id: string } }>(
    "/races/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    deleteRace
  );
}
