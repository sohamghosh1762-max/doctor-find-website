import express from "express";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

import {
  getDashboardStats,
  getMonthlyAppointments
} from "../controllers/adminController.js";

const router = express.Router();


router.get(
  "/stats",
  getDashboardStats
);

router.get(
  "/monthly-appointments",
  getMonthlyAppointments
);

export default router;