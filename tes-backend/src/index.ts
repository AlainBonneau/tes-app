import { buildApp } from "./app";

const port = Number(process.env.PORT) || 3001;
const host = "0.0.0.0";

buildApp().then((app) => {
  app.listen({ port, host }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`🚀 Serveur lancé sur ${address}`);
  });
});
