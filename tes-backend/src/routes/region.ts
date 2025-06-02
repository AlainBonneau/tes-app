import { FastifyInstance } from "fastify";
import { getAllRegions, getRegionById } from "../controllers/regionController";

export default async function regionRoutes(app: FastifyInstance) {
  app.get("/regions", getAllRegions);
  app.get<{ Params: { id: string } }>("/regions/:id", getRegionById);
}
