import express from "express";
import { getActivities } from "../controllers/activityController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getActivities);

export default router;