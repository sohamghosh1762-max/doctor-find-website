import express from "express";
import {
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get("/:id", getUserById);
router.put("/:id", updateUserByAdmin);
router.delete("/:id", deleteUserByAdmin);

export default router;
