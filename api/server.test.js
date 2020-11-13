const request = require("supertest");
const server = require("./server");

describe("Auth router", () => {
  describe("[Post] /api/auth/register", () => {
    it("works", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "sahari", password: "1234" });
      expect(res.status).toBe(201);
    });
  });
});
