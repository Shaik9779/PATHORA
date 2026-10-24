
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.patch("/", authMiddleware, updateProfile);

module.exports = router;
