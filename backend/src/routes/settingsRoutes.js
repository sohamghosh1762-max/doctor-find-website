import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get("/", getSettings);
router.put("/", updateSettings);

export default router;