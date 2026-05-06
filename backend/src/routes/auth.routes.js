const express = require("express");
const authRateLimiter = require("../middlewares/authRateLimit.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);

module.exports = router;
