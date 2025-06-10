import request from "supertest";
import { buildApp } from "../src/app";
import { PrismaClient } from "@prisma/client";

describe("Comments API", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let server: import("http").Server;
  const prisma = new PrismaClient();

  let authorToken: string;
  let otherToken: string;
  let adminToken: string;
  let postId: number;
  let commentId: number;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
    server = app.server;

    // Create users
    await request(server).post("/users/register").send({
      email: "auth@test.com",
      username: "auth",
      password: "pwd",
    });
    const authLogin = await request(server)
      .post("/users/login")
      .send({ email: "auth@test.com", password: "pwd" });
    authorToken = authLogin.body.token;

    await request(server).post("/users/register").send({
      email: "other@test.com",
      username: "other",
      password: "pwd",
    });
    const otherLogin = await request(server)
      .post("/users/login")
      .send({ email: "other@test.com", password: "pwd" });
    otherToken = otherLogin.body.token;

    // Promote author to admin for later
    const user = await prisma.user.findUnique({
      where: { email: "auth@test.com" },
    });
    await prisma.user.update({
      where: { id: user!.id },
      data: { role: "admin" },
    });
    const adminLogin = await request(server)
      .post("/users/login")
      .send({ email: "auth@test.com", password: "pwd" });
    adminToken = adminLogin.body.token;

    // Create region & race & post for comments
    const regionRes = await request(server)
      .post("/regions")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "R", description: "D", imageUrl: "" });
    const raceRes = await request(server)
      .post("/races")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "Rc", origine: "O", description: "D" });
    const regionId = regionRes.body.id;
    const raceId = raceRes.body.id;
    const postRes = await request(server)
      .post("/posts")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ title: "Title", content: "Body" });
    postId = postRes.body.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it("GET /posts/:postId/comments returns empty array", async () => {
    const res = await request(server).get(`/posts/${postId}/comments`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("POST /posts/9999/comments returns 404", async () => {
    const res = await request(server)
      .post("/posts/9999/comments")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "Hello" });
    expect(res.status).toBe(404);
  });

  it("POST /posts/:postId/comments without token fails", async () => {
    const res = await request(server)
      .post(`/posts/${postId}/comments`)
      .send({ content: "NoAuth" });
    expect(res.status).toBe(401);
  });

  it("POST /posts/:postId/comments with token succeeds", async () => {
    const res = await request(server)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "First comment" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.content).toBe("First comment");
    commentId = res.body.id;
  });

  it("GET /posts/:postId/comments returns non-empty array", async () => {
    const res = await request(server).get(`/posts/${postId}/comments`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("PATCH /comments/:id by non-author fails", async () => {
    const res = await request(server)
      .patch(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ content: "Hack" });
    expect(res.status).toBe(403);
  });

  it("PATCH /comments/:id by author succeeds", async () => {
    const res = await request(server)
      .patch(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "Edited comment" });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("Edited comment");
  });

  it("PATCH /comments/9999 returns 404", async () => {
    const res = await request(server)
      .patch("/comments/9999")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "X" });
    expect(res.status).toBe(404);
  });

  it("DELETE /comments/:id by non-author fails", async () => {
    // create a second comment by other user
    const res2 = await request(server)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ content: "Other comment" });
    const otherCommentId = res2.body.id;

    const res = await request(server)
      .delete(`/comments/${otherCommentId}`)
      .set("Authorization", `Bearer ${authorToken}`);
    expect(res.status).toBe(403);
  });

  it("DELETE /comments/:id by author succeeds", async () => {
    const res = await request(server)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${authorToken}`);
    expect(res.status).toBe(204);
  });

  it("DELETE /comments/:id by admin succeeds", async () => {
    // create a fresh comment
    const fresh = await request(server)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ content: "Fresh" });
    const freshId = fresh.body.id;

    const res = await request(server)
      .delete(`/comments/${freshId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });

  it("DELETE /comments/9999 returns 404", async () => {
    const res = await request(server)
      .delete("/comments/9999")
      .set("Authorization", `Bearer ${authorToken}`);
    expect(res.status).toBe(404);
  });
});
