import { FastifyInstance } from "fastify";
import cloudinary from "../config/cloudinary";

export default async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (req, reply) => {
    const data = await req.file();
    if (!data) return reply.code(400).send({ error: "Aucun fichier reçu." });

    try {
      const url = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) return reject(error);
            if (!result)
              return reject(new Error("Aucune réponse de Cloudinary"));
            resolve(result.secure_url);
          }
        );
        data.file.pipe(stream);
      });

      reply.send({ url });
    } catch (err: any) {
      reply.code(500).send({ error: err.message || "Erreur lors de l'upload" });
    }
  });
}
