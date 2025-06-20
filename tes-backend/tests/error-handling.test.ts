// tests/error-handling.test.ts
import request from "supertest";
import { getAdminToken } from "./utils/getAdminToken";
import { buildApp } from "../src/app";
import { PrismaClient } from "@prisma/client";

describe("Error handling and validation", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let server: import("http").Server;
  let prisma: PrismaClient;
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    app = await buildApp();
    await app.ready();
    server = app.server;

    adminToken = await getAdminToken(app);

    // create a user to obtain a JWT
    await request(server).post("/users/register").send({
      email: "test@e2e.com",
      username: "e2euser",
      password: "pass123",
    });
    const loginRes = await request(server)
      .post("/users/login")
      .send({ email: "test@e2e.com", password: "pass123" });
    userToken = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it("400 on missing fields for POST /creatures", async () => {
    const res = await request(server)
      .post("/creatures")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ type: "Beast", description: "No name field" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("401 on protected POST /posts without JWT", async () => {
    const res = await request(server)
      .post("/posts")
      .send({ title: "X", content: "Y" });
    expect(res.status).toBe(401);
  });

  it("404 on POST /posts/9999/comments with JWT", async () => {
    const res = await request(server)
      .post("/posts/9999/comments")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "Invalid ref" });
    expect(res.status).toBe(404);
  });

  it("429 on rate limit exceeded for GET /creatures", async () => {
    let res;
    for (let i = 0; i < 101; i++) {
      res = await request(server).get("/creatures");
    }
    expect(res!.status).toBe(429);
  });
});
