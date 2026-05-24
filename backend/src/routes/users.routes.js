const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
	getProfile,
	updateProfile,
	updatePreferences,
	changePassword,
	getAddresses,
	addAddress,
	updateAddress,
	deleteAddress,
} = require("../controllers/auth.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/preferences", updatePreferences);
router.put("/change-password", changePassword);
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:id", updateAddress);
router.delete("/addresses/:id", deleteAddress);

module.exports = router;