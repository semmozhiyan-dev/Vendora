const request = require("supertest");
const app = require("../src/app");

describe("Auth API", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should reject registration with missing fields", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject registration with invalid email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          email: "invalid-email",
          password: "password123",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject registration with short password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "123",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should reject login with missing fields", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject login with invalid email format", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "not-an-email",
          password: "password123",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
