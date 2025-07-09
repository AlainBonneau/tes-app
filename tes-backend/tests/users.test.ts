import request from "supertest";
import { buildApp } from "../src/app";
import { PrismaClient } from "@prisma/client";

describe("Users API", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let server: import("http").Server;
  let prisma: PrismaClient;

  const testUser = {
    email: "[user@test.com](mailto:user@test.com)",
    username: "user",
    password: "secretPwd",
  };

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
    server = app.server;
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it("POST /users/register should succeed", async () => {
    const res = await request(server)
      .post("/users/register")
      .send(testUser)
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(testUser.email);
    expect(res.body.username).toBe(testUser.username);
    expect(res.body).not.toHaveProperty("password");
  });

  it("POST /users/register missing fields should fail", async () => {
    const res = await request(server)
      .post("/users/register")
      .send({ email: "[noUser@test.com](mailto:noUser@test.com)" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/requis/);
  });

  it("POST /users/register duplicate email should fail", async () => {
    // same email as testUser
    const res = await request(server)
      .post("/users/register")
      .send(testUser)
      .set("Content-Type", "application/json");
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/déjà utilisé/);
  });

  let userToken: string;

  it("POST /users/login should succeed and return JWT", async () => {
    const res = await request(server)
      .post("/users/login")
      .send({ email: testUser.email, password: testUser.password })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    userToken = res.body.token;
  });

  it("POST /users/login wrong password should fail", async () => {
    const res = await request(server)
      .post("/users/login")
      .send({ email: testUser.email, password: "wrongPwd" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(401);
  });

  it("POST /users/login unknown email should fail", async () => {
    const res = await request(server)
      .post("/users/login")
      .send({
        email: "[unknown@test.com](mailto:unknown@test.com)",
        password: "pwd",
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(401);
  });

  it("GET /users/me with valid token should succeed", async () => {
    const res = await request(server)
      .get("/users/me")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });

  it("GET /users/me without token should fail", async () => {
    const res = await request(server).get("/users/me");
    expect(res.status).toBe(401);
  });

  it("GET /users/me with invalid token should fail", async () => {
    const res = await request(server)
      .get("/users/me")
      .set("Authorization", "Bearer invalid.token.here");
    expect(res.status).toBe(401);
  });

  it("GET /users without token should fail", async () => {
    const res = await request(server).get("/users");
    expect(res.status).toBe(401);
  });

  it("GET /users as non-admin should fail", async () => {
    const res = await request(server)
      .get("/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it("GET /users as admin should succeed", async () => {
    // Promote testUser to admin directly in DB
    const user = await prisma.user.findUnique({
      where: { email: testUser.email },
    });
    await prisma.user.update({
      where: { id: user!.id },
      data: { role: "admin" },
    });
    // Generate a new token with role=admin
    const adminToken = (app as any).jwt.sign({
      id: user!.id,
      email: user!.email,
      username: user!.username,
      role: "admin",
    });

    const res = await request(server)
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
