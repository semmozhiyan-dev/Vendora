const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vendora E-Commerce API",
      version: "1.0.0",
      description: "Complete REST API for Vendora e-commerce platform with Razorpay payment integration",
      contact: {
        name: "API Support",
        email: "support@vendora.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:8000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
