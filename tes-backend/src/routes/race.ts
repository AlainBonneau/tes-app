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
      faction: string;
      description: string;
    };
  }>("/races", createRace);
  app.patch<{
    Params: { id: string };
    Body: {
      name: string;
      faction: string;
      description: string;
    };
  }>("/races/:id", updateRace);
  app.delete<{ Params: { id: string } }>("/races/:id", deleteRace);
}
