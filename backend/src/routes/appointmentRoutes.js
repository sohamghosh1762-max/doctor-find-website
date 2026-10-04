import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  rescheduleAppointment,
  cancelAppointment,
  updateAppointmentStatus,
  getAllAppointments,
  getDoctorAppointments,
} from "../controllers/appointmentController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin, isDoctorOrAdmin } from "../middleware/roleMiddleware.js";
import { validateAppointment } from "../middleware/validateMiddleware.js";

const router = express.Router();

// All appointment operations require authentication
router.use(protect);

// My appointments (Patient / Doctor / Admin context-aware)
router.get("/", getMyAppointments);
router.get("/my-appointments", getMyAppointments);

// Book appointment
router.post("/", validateAppointment, bookAppointment);
router.post("/book", validateAppointment, bookAppointment);

// Doctor appointments
router.get("/doctor", isDoctorOrAdmin, getDoctorAppointments);
router.get("/doctor/:doctorId", isDoctorOrAdmin, getDoctorAppointments);

// Admin appointments
router.get("/admin/all", isAdmin, getAllAppointments);

// Single appointment operations with ownership checks
router.get("/:id", getAppointmentById);
router.patch("/:id", rescheduleAppointment);
router.patch("/:id/reschedule", rescheduleAppointment);
router.patch("/:id/status", updateAppointmentStatus);
router.patch("/:id/cancel", cancelAppointment);
router.put("/:id/cancel", cancelAppointment);
router.delete("/:id", cancelAppointment);

export default router;