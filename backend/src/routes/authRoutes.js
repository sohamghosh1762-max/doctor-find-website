import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
// Protected Route
router.get("/profile", protect, getProfile);

export default router;