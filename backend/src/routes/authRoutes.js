import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, validateRegister, registerUser);
router.post("/login", authLimiter, validateLogin, loginUser);

// Protected Routes
router.get("/profile", protect, getProfile);
router.get("/users", protect, isAdmin, getAllUsers);

export default router;