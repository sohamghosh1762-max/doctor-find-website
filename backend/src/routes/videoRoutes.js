import express from "express";
import Appointment from "../models/Appointment.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Get Video Consultation Room Details (Protected - Must be participant)
router.get("/room/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
        code: "APPOINTMENT_NOT_FOUND",
      });
    }

    const userId = String(req.user._id);
    const isPatient = String(appointment.patient) === userId;
    const isDoctor = appointment.doctor && String(appointment.doctor) === userId;
    const isAdmin = req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not an authorized participant in this consultation.",
        code: "UNAUTHORIZED_ROOM_ACCESS",
      });
    }

    const roomName = `DoctorFindAI-${appointment._id}`;
    const roomUrl = `https://meet.jit.si/${roomName}`;

    res.status(200).json({
      success: true,
      provider: "Jitsi Meet (Open Healthcare WebRTC Room)",
      appointmentId: appointment._id,
      roomName,
      roomUrl,
      patientName: isDoctor ? (appointment.patient?.name || "Patient") : undefined,
      doctorName: appointment.doctorName,
      scheduledTime: `${appointment.appointmentDate} ${appointment.appointmentTime}`,
      status: appointment.status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create consultation room.",
      code: "VIDEO_ROOM_ERROR",
    });
  }
});

export default router;
