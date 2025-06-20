import request from "supertest";
import { getAdminToken } from "./utils/getAdminToken";
import { buildApp } from "../src/app";

// Étend le timeout si besoin
jest.setTimeout(10000);

describe("Creatures API", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let server: import("http").Server;
  let adminToken: string;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready(); 
    server = app.server;

    adminToken = await getAdminToken(app);
  });

  afterAll(async () => {
    await app.close(); 
  });

  it("GET /creatures doit renvoyer un tableau", async () => {
    const res = await request(server).get("/creatures");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /creatures crée puis GET /creatures/:id renvoie la créature", async () => {
    const payload = {
      name: "TestCreature",
      type: "Animal",
      description: "Description de test",
    };

    // Création
    const postRes = await request(server)
      .post("/creatures")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload)
      .set("Content-Type", "application/json");
    expect(postRes.status).toBe(201);
    expect(postRes.body).toMatchObject(payload);

    // Récupération
    const getRes = await request(server).get(`/creatures/${postRes.body.id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe(payload.name);
  });
});
