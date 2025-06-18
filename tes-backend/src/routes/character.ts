import { FastifyInstance } from "fastify";
import {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "../controllers/charactersController";

export default async function characterRoutes(app: FastifyInstance) {
  app.get("/characters", getAllCharacters);
  app.get<{ Params: { id: string } }>("/characters/:id", getCharacterById);
  app.post<{
    Body: {
      name: string;
      description: string;
      imageUrl?: string;
      regionId: number;
      raceId: number;
    };
  }>(
    "/characters",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    createCharacter
  );
  app.patch<{
    Params: { id: string };
    Body: {
      name: string;
      description: string;
      imageUrl?: string;
      regionId: number;
      raceId: number;
    };
  }>(
    "/characters/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    updateCharacter
  );
  app.delete<{ Params: { id: string } }>(
    "/characters/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    deleteCharacter
  );
}
