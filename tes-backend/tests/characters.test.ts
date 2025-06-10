// tests/characters.test.ts
import request from "supertest";
import { buildApp } from "../src/app";

describe("Characters API", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let server: import("http").Server;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
    server = app.server;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /characters should return an array", async () => {
    const res = await request(server).get("/characters");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /characters creates and returns new character", async () => {
    // -> Create a region
    const regionRes = await request(server)
      .post("/regions")
      .send({ name: "TestRegion", description: "Desc", imageUrl: "http://img" })
      .set("Content-Type", "application/json");
    expect(regionRes.status).toBe(201);
    const regionId = regionRes.body.id;

    // -> Create a race
    const raceRes = await request(server)
      .post("/races")
      .send({ name: "TestRace", origine: "Origine", description: "Desc" })
      .set("Content-Type", "application/json");
    expect(raceRes.status).toBe(201);
    const raceId = raceRes.body.id;

    // -> Create the character
    const payload = {
      name: "Hero",
      description: "Brave Adventurer",
      imageUrl: "http://hero.img",
      regionId,
      raceId,
    };

    const postRes = await request(server)
      .post("/characters")
      .send(payload)
      .set("Content-Type", "application/json");

    expect(postRes.status).toBe(201);
    expect(postRes.body).toMatchObject(payload);

    // -> Verify GET by ID
    const id = postRes.body.id;
    const getRes = await request(server).get(`/characters/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe(payload.name);
  });

  it("PATCH /characters/:id updates and returns character", async () => {
    // -> Setup fresh region & race
    const regionRes = await request(server)
      .post("/regions")
      .send({ name: "PatchRegion", description: "Desc", imageUrl: "" })
      .set("Content-Type", "application/json");
    const raceRes = await request(server)
      .post("/races")
      .send({ name: "PatchRace", origine: "Origine", description: "Desc" })
      .set("Content-Type", "application/json");
    const regionId = regionRes.body.id;
    const raceId = raceRes.body.id;

    // -> Create character
    const postRes = await request(server)
      .post("/characters")
      .send({ name: "ToUpdate", description: "Desc", regionId, raceId })
      .set("Content-Type", "application/json");
    const id = postRes.body.id;

    // -> Patch only description
    const update = { description: "Updated Desc" };
    const patchRes = await request(server)
      .patch(`/characters/${id}`)
      .send(update)
      .set("Content-Type", "application/json");
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.description).toBe(update.description);
  });

  it("DELETE /characters/:id deletes character", async () => {
    // -> Setup fresh region & race
    const regionRes = await request(server)
      .post("/regions")
      .send({ name: "DelRegion", description: "D", imageUrl: "" })
      .set("Content-Type", "application/json");
    const raceRes = await request(server)
      .post("/races")
      .send({ name: "DelRace", origine: "O", description: "D" })
      .set("Content-Type", "application/json");
    const regionId = regionRes.body.id;
    const raceId = raceRes.body.id;

    // -> Create character to delete
    const postRes = await request(server)
      .post("/characters")
      .send({ name: "ToDelete", description: "D", regionId, raceId })
      .set("Content-Type", "application/json");
    const id = postRes.body.id;

    // -> Delete
    const delRes = await request(server).delete(`/characters/${id}`);
    expect(delRes.status).toBe(204);

    // -> Verify 404
    const getRes = await request(server).get(`/characters/${id}`);
    expect(getRes.status).toBe(404);
  });
});
