import express from "express";
import {
  getMyNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;