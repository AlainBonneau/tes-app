import request from "supertest";
import { getAdminToken } from "./utils/getAdminToken";
import { buildApp } from "../src/app";

describe("Regions API", () => {
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

  it("GET /regions should return an array", async () => {
    const res = await request(server).get("/regions");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /regions creates and returns new region", async () => {
    const payload = {
      name: "TestRegion",
      description: "Desc test",
      imageUrl: "[http://example.com/img.png](http://example.com/img.png)",
    };
    const postRes = await request(server)
      .post("/regions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload)
      .set("Content-Type", "application/json");
    expect(postRes.status).toBe(201);
    expect(postRes.body).toMatchObject(payload);

    const id = postRes.body.id;
    const getRes = await request(server).get(`/regions/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe("TestRegion");
  });

  it("PATCH /regions/:id updates and returns region", async () => {
    // Create a new region to update
    const payload = { name: "OtherRegion", description: "Desc" };
    const postRes = await request(server)
      .post("/regions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload)
      .set("Content-Type", "application/json");
    const id = postRes.body.id;

    const update = { description: "Updated description" };
    const patchRes = await request(server)
      .patch(`/regions/${id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(update)
      .set("Content-Type", "application/json");
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.description).toBe("Updated description");
  });

  it("DELETE /regions/:id deletes region", async () => {
    // Create a new region to delete
    const payload = { name: "TempRegion", description: "Temp" };
    const postRes = await request(server)
      .post("/regions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload)
      .set("Content-Type", "application/json");
    const id = postRes.body.id;

    const delRes = await request(server)
      .delete(`/regions/${id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(delRes.status).toBe(204);

    const getRes = await request(server).get(`/regions/${id}`);
    expect(getRes.status).toBe(404);
  });
});
