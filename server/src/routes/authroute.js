const express = require("express");

const { login, me, register } = require("../Controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

module.exports = router;
