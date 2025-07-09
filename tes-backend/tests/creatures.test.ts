import request from "supertest";
import { getAdminToken } from "./utils/getAdminToken";
import { buildApp } from "../src/app";

jest.setTimeout(10000);

describe("Creatures API", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let server: import("http").Server;
  let adminToken: string;
  let authorToken: string;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
    server = app.server;

    adminToken = await getAdminToken(app);
    authorToken = await getAdminToken(app);
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
    // --- CRÉATION DE LA RÉGION ---
    const regionRes = await request(server)
      .post("/regions")
      .set("Cookie", `token=${authorToken}`)
      .send({
        name: "TestRegion",
        description: "Description de test",
        imageUrl: "",
      })
      .set("Content-Type", "application/json");
    expect(regionRes.status).toBe(201);

    const regionId = regionRes.body.id;

    // --- CRÉATION DE LA CRÉATURE ---
    const payload = {
      name: "TestCreature",
      type: "Animal",
      description: "Description de test",
      regionId,
    };

    const postRes = await request(server)
      .post("/creatures")
      .set("Cookie", `token=${authorToken}`)
      .send(payload)
      .set("Content-Type", "application/json");

    expect(postRes.status).toBe(201);
    expect(postRes.body.name).toBe(payload.name);
    expect(postRes.body.type).toBe(payload.type);
    expect(postRes.body.description).toBe(payload.description);

    // --- RÉCUPÉRATION ---
    const getRes = await request(server).get(`/creatures/${postRes.body.id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe(payload.name);
  });
});
