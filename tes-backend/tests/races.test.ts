import request from "supertest";
import { getAdminToken } from "./utils/getAdminToken";
import { buildApp } from "../src/app";

describe("Races API", () => {
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

  it("GET /races should return an array", async () => {
    const res = await request(server).get("/races");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /races creates and returns new race", async () => {
    const payload = {
      name: "Nordique",
      origine: "Alliance nordique",
      description: "Les fiers guerriers du Nord d",
    };
    const postRes = await request(server)
      .post("/races")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload)
      .set("Content-Type", "application/json");
    expect(postRes.status).toBe(201);
    expect(postRes.body).toMatchObject(payload);

    const id = postRes.body.id;
    const getRes = await request(server).get(`/races/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe(payload.name);
  });

  it("PATCH /races/:id updates and returns race", async () => {
    const payload = {
      name: "Khajiit",
      origine: "Tributaires",
      description: "Des hommes/femmes chat",
    };
    const postRes = await request(server)
      .post("/races")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload)
      .set("Content-Type", "application/json");
    const id = postRes.body.id;

    const update = { description: "Peaux-fines félines" };
    const patchRes = await request(server)
      .patch(`/races/${id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(update)
      .set("Content-Type", "application/json");
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.description).toBe(update.description);
  });

  it("DELETE /races/:id deletes race", async () => {
    const payload = {
      name: "Argonien",
      origine: "Guerriers marécages",
      description: "Habitants des marais de Black Marsh",
    };
    const postRes = await request(server)
      .post("/races")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload)
      .set("Content-Type", "application/json");
    const id = postRes.body.id;

    const delRes = await request(server)
      .delete(`/races/${id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(delRes.status).toBe(204);

    const getRes = await request(server).get(`/races/${id}`);
    expect(getRes.status).toBe(404);
  });
});
