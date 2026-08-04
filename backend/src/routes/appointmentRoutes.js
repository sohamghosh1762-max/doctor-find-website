import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  rescheduleAppointment,
  cancelAppointment,
  getAllAppointments,
  getDoctorAppointments
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", getMyAppointments);
router.post("/", bookAppointment);
router.post("/book", bookAppointment);
router.get("/my-appointments", getMyAppointments);
router.get("/doctor", getDoctorAppointments);
router.get("/doctor/:doctorId", getDoctorAppointments);

router.get("/:id", getAppointmentById);
router.patch("/:id", rescheduleAppointment);
router.patch("/:id/reschedule", rescheduleAppointment);
router.put("/:id/cancel", cancelAppointment);
router.patch("/:id/cancel", cancelAppointment);
router.delete("/:id", cancelAppointment);

export default router;