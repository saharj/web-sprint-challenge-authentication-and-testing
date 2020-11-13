const db = require("../database/dbConfig");
const User = require("./userModel");

beforeEach(async () => {
  await db("users").truncate();
});

describe("Users model", () => {
  describe("add()", () => {
    it("inserts a new user", async () => {
      await User.add({ username: "new-user", password: "pass123" });

      let user = await db("users");
      expect(user).toHaveLength(1);
    });
    it("gives back the new added user", async () => {
      const user = await User.add({
        username: "new-user",
        password: "pass123",
      });
      expect(user).toMatchObject({
        id: 1,
        username: "new-user",
        password: "pass123",
      });
    });
  });

  describe("findBy()", () => {
    it("finds user with given username", async () => {
      await User.add({ username: "new-user", password: "pass123" });

      let user = await User.findBy({ username: "new-user" });
      expect(user.username).toBe("new-user");
    });

    it("doesn't work when username doesn't exist", async () => {
      await User.add({ username: "new-user", password: "pass123" });

      let user = await User.findBy({ username: "user" });
      expect(user).toBe(undefined);
    });
  });

  describe("findById()", () => {
    it("finds user with given id", async () => {
      await User.add({ username: "new-user", password: "pass123" });

      let user = await User.findById(1);
      expect(user.username).toBe("new-user");
    });
  });
});
