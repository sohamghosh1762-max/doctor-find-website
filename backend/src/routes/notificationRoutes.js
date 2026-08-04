import express from "express";
import {
  createNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/", getMyNotifications);
router.get("/my", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;