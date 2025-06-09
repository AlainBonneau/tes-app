// src/index.ts
import { buildApp } from "./app";

const port = Number(process.env.PORT) || 3001;

buildApp().then((app) => {
  app.listen({ port }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`🚀 Serveur lancé sur ${address}`);
  });
});
