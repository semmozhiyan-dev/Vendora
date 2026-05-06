const request = require("supertest");
const app = require("../src/app");

describe("Health Check API", () => {
  describe("GET /health", () => {
    it("should return 200 and health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /", () => {
    it("should return 200 and API running message", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "API is running...",
      });
    });
  });
});
