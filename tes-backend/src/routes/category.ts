import { FastifyInstance } from "fastify";
import {
  getAllForumCategories,
  getForumCategoryById,
  createForumCategory,
  updateForumCategory,
  deleteForumCategory,
} from "../controllers/categoryController";

export default async function categoryRoutes(app: FastifyInstance) {
  app.get("/categories", getAllForumCategories);
  app.get<{ Params: { id: string } }>("/categories/:id", getForumCategoryById);
  app.post<{
    Body: {
      name: string;
      desc: string;
      icon?: string;
      slug: string;
    };
  }>("/categories", { preHandler: [app.authenticate] }, createForumCategory);
  app.patch<{
    Params: { id: string };
    Body: Partial<{
      name: string;
      desc: string;
      icon?: string;
      slug: string;
    }>;
  }>(
    "/categories/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    updateForumCategory
  );
  app.delete<{ Params: { id: string } }>(
    "/categories/:id",
    { preHandler: [app.authenticate, app.authorizeAdmin] },
    deleteForumCategory
  );
}
