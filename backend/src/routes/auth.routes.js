const express = require("express");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const authRateLimiter = require("../middlewares/authRateLimit.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

const ensureGoogleOAuthConfigured = (req, res, next) => {
	const hasGoogleOAuthConfig = Boolean(
		process.env.GOOGLE_CLIENT_ID &&
		process.env.GOOGLE_CLIENT_SECRET &&
		process.env.GOOGLE_CALLBACK_URL
	);

	if (!hasGoogleOAuthConfig) {
		return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_not_configured`);
	}

	return next();
};

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);

router.get(
	"/google",
	ensureGoogleOAuthConfigured,
	passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
	"/google/callback",
	ensureGoogleOAuthConfigured,
	passport.authenticate("google", {
		failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
	}),
	(req, res) => {
		const token = jwt.sign(
			{ userId: req.user._id, email: req.user.email, role: req.user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
	}
);

module.exports = router;
