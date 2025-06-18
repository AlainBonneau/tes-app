import { FastifyInstance } from "fastify";
import {
  getAllRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
} from "../controllers/regionController";

export default async function regionRoutes(app: FastifyInstance) {
  app.get("/regions", getAllRegions);
  app.get<{ Params: { id: string } }>("/regions/:id", getRegionById);
  app.post<{
    Body: {
      name: string;
      description: string;
      imageUrl?: string;
    };
  }>(
    "/regions",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    createRegion
  );
  app.patch<{
    Params: { id: string };
    Body: {
      name: string;
      description: string;
      imageUrl?: string;
    };
  }>(
    "/regions/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    updateRegion
  );
  app.delete<{ Params: { id: string } }>(
    "/regions/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    deleteRegion
  );
}
