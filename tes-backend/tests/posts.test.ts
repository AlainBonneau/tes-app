import request from "supertest";
import { buildApp } from "../src/app";
import { PrismaClient } from "@prisma/client";

describe("Posts API", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let server: import("http").Server;
  let prisma: PrismaClient;

  let userToken: string;
  let otherToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Build and start Fastify
    app = await buildApp();
    await app.ready();
    server = app.server;

    // Prisma client for role management
    prisma = new PrismaClient();

    // Create primary user
    await request(server)
      .post("/users/register")
      .send({ email: "userA@test.com", username: "userA", password: "pwdA" });
    const loginRes = await request(server)
      .post("/users/login")
      .send({ email: "userA@test.com", password: "pwdA" });
    userToken = loginRes.body.token;

    // Create other user
    await request(server)
      .post("/users/register")
      .send({ email: "userB@test.com", username: "userB", password: "pwdB" });
    const loginRes2 = await request(server)
      .post("/users/login")
      .send({ email: "userB@test.com", password: "pwdB" });
    otherToken = loginRes2.body.token;

    // Promote userA to admin
    const userA = await prisma.user.findUnique({
      where: { email: "userA@test.com" },
    });
    await prisma.user.update({
      where: { id: userA!.id },
      data: { role: "admin" },
    });
    // New token with admin role
    const adminRes = await request(server)
      .post("/users/login")
      .send({ email: "userA@test.com", password: "pwdA" });
    adminToken = adminRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it("GET /posts should return an array", async () => {
    const res = await request(server).get("/posts");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /posts/:id for nonexistent returns 404", async () => {
    const res = await request(server).get("/posts/9999");
    expect(res.status).toBe(404);
  });

  it("POST /posts without token should fail", async () => {
    const res = await request(server)
      .post("/posts")
      .send({ title: "T1", content: "C1" });
    expect(res.status).toBe(401);
  });

  let postId: number;
  it("POST /posts with token should succeed", async () => {
    const res = await request(server)
      .post("/posts")
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ title: "Hello", content: "World" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Hello");
    postId = res.body.id;
  });

  it("GET /posts/:id should include author and comments array", async () => {
    const res = await request(server).get(`/posts/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("author");
    expect(Array.isArray(res.body.comments)).toBe(true);
  });

  it("PATCH /posts/:id by non-author should fail", async () => {
    const res = await request(server)
      .patch(`/posts/${postId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "X" });
    expect(res.status).toBe(403);
  });

  it("PATCH /posts/:id by author should succeed", async () => {
    const res = await request(server)
      .patch(`/posts/${postId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ title: "Updated" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated");
  });

  it("PATCH /posts/9999 returns 404", async () => {
    const res = await request(server)
      .patch(`/posts/9999`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ title: "X" });
    expect(res.status).toBe(404);
  });

  it("DELETE /posts/:id by non-author should fail", async () => {
    const res = await request(server)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it("DELETE /posts/:id by author should succeed", async () => {
    const res = await request(server)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${otherToken}`);
    expect(res.status).toBe(204);
  });

  it("DELETE /posts/9999 returns 404", async () => {
    const res = await request(server)
      .delete(`/posts/9999`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
