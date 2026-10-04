import express from "express";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import {
  getDashboardStats,
  getMonthlyAppointments,
  getAuditLogs,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get("/stats", getDashboardStats);
router.get("/monthly-appointments", getMonthlyAppointments);
router.get("/audit-logs", getAuditLogs);

export default router;