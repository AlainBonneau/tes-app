import { FastifyInstance } from "fastify";
import {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "../controllers/charactersController";

export default async function characterRoutes (app: FastifyInstance) {
  app.get("/caracteres", getAllCharacters);
  app.get<{ Params: { id: string } }>("/caracteres/:id", getCharacterById);
  app.post<{
    Body: {
      name: string;
      description: string;
      imageUrl?: string;
      regionId: number;
      raceId: number;
    };
  }>("/caracteres", createCharacter);
  app.patch<{
    Params: { id: string };
    Body: {
      name: string;
      description: string;
      imageUrl?: string;
      regionId: number;
      raceId: number;
    };
  }>("/caracteres/:id", updateCharacter);
  app.delete<{ Params: { id: string } }>("/caracteres/:id", deleteCharacter);
}
