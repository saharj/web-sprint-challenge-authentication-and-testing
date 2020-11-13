const request = require("supertest");
const server = require("./server");
const db = require("../database/dbConfig");

beforeEach(async () => {
  await db("users").truncate();
});

describe("Auth router", () => {
  describe("[Post] /api/auth/register", () => {
    it("works", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "sahari", password: "1234" });
      expect(res.status).toBe(201);
      expect(res.type).toMatch(/json/);
    });

    it("doesn't work when no password", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "sahari" });
      expect(res.status).toBe(400);
    });
  });

  describe("[Post] /api/auth/login", () => {
    it("logs the user in", async () => {
      const user = { username: "sahari", password: "1234" };
      await request(server).post("/api/auth/register").send(user);
      const res = await request(server).post("/api/auth/login").send(user);
      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
    });
    it("throws if the password is incorrect", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "sahari", password: "12345" });
      expect(res.status).toBe(401);
    });
  });
});
