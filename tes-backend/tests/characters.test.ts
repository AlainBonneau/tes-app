import request from "supertest";
import { buildApp } from "../src/app";

describe("Characters API", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let server: import("http").Server;
  let adminToken: string;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
    server = app.server;

    const user = await app.prisma.user.create({
      data: {
        email: "admin@test.com",
        username: "admin",
        password: "hashed",
        role: "admin",
      },
    });

    adminToken = (app as any).jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username,
      role: "admin",
    });
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
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "TestRegion", description: "Desc", imageUrl: "http://img" })
      .set("Content-Type", "application/json");
    expect(regionRes.status).toBe(201);
    const regionId = regionRes.body.id;

    // -> Create a race
    const raceRes = await request(server)
      .post("/races")
      .set("Authorization", `Bearer ${adminToken}`)
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
      .set("Authorization", `Bearer ${adminToken}`)
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
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "PatchRegion", description: "Desc", imageUrl: "" })
      .set("Content-Type", "application/json");
    const raceRes = await request(server)
      .post("/races")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "PatchRace", origine: "Origine", description: "Desc" })
      .set("Content-Type", "application/json");
    const regionId = regionRes.body.id;
    const raceId = raceRes.body.id;

    // -> Create character
    const postRes = await request(server)
      .post("/characters")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "ToUpdate", description: "Desc", regionId, raceId })
      .set("Content-Type", "application/json");
    const id = postRes.body.id;

    // -> Patch only description
    const update = { description: "Updated Desc" };
    const patchRes = await request(server)
      .patch(`/characters/${id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(update)
      .set("Content-Type", "application/json");
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.description).toBe(update.description);
  });

  it("DELETE /characters/:id deletes character", async () => {
    const regionRes = await request(server)
      .post("/regions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "DelRegion", description: "D", imageUrl: "" })
      .set("Content-Type", "application/json");
    const raceRes = await request(server)
      .post("/races")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "DelRace", origine: "O", description: "D" })
      .set("Content-Type", "application/json");
    const regionId = regionRes.body.id;
    const raceId = raceRes.body.id;

    const postRes = await request(server)
      .post("/characters")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "ToDelete", description: "D", regionId, raceId })
      .set("Content-Type", "application/json");
    const id = postRes.body.id;

    const delRes = await request(server)
      .delete(`/characters/${id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(delRes.status).toBe(204);

    const getRes = await request(server).get(`/characters/${id}`);
    expect(getRes.status).toBe(404);
  });
});
