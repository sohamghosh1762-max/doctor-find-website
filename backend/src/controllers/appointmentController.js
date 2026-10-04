import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Notification from "../models/Notification.js";
import { logAuditEvent } from "../services/auditService.js";

// Helper: generate Jitsi room link
const generateVideoRoomUrl = (appointmentId) => {
  return `https://meet.jit.si/DoctorFindAI-${appointmentId}`;
};

// Book Appointment (Protected - Patient / Admin)
export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;

    const {
      doctor,
      doctorName,
      doctorImage,
      specialization,
      hospital,
      appointmentDate,
      appointmentTime,
      mode = "Online",
      symptoms = "Routine consultation",
      consultationFee = 800,
    } = req.body;

    let resolvedDoctorName = doctorName;
    let resolvedDoctorImage = doctorImage;
    let resolvedSpecialization = specialization;
    let resolvedHospital = hospital;
    let resolvedFee = consultationFee;

    // Fetch doctor record if doctor ID provided
    if (doctor) {
      const docRecord = await Doctor.findById(doctor);
      if (docRecord) {
        resolvedDoctorName = docRecord.name;
        resolvedDoctorImage = docRecord.profileImage || doctorImage;
        resolvedSpecialization = docRecord.specialization || specialization;
        resolvedHospital = docRecord.hospital || hospital;
        resolvedFee = docRecord.fees || consultationFee;
      }
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctor || null,
      doctorName: resolvedDoctorName || "Dr. Ananya Sharma",
      doctorImage: resolvedDoctorImage || "",
      specialization: resolvedSpecialization || "General Medicine",
      hospital: resolvedHospital || "Apollo Hospital",
      appointmentDate,
      appointmentTime,
      mode,
      status: "Confirmed",
      symptoms,
      videoCallUrl: "",
      consultationFee: resolvedFee,
    });

    if (mode === "Online") {
      appointment.videoCallUrl = generateVideoRoomUrl(appointment._id);
      await appointment.save();
    }

    // Create Notification for Patient
    await Notification.create({
      user: patientId,
      title: "Appointment Booked Successfully",
      message: `Your ${mode} appointment with ${appointment.doctorName} is confirmed for ${appointment.appointmentDate} at ${appointment.appointmentTime}.`,
      type: "appointment",
      linkId: String(appointment._id),
    });

    // If doctor is in Doctor model, notify them if they have a User profile or notification channel
    if (doctor) {
      await Notification.create({
        user: doctor,
        title: "New Patient Consultation Scheduled",
        message: `New ${mode} consultation scheduled with patient for ${appointment.appointmentDate} at ${appointment.appointmentTime}.`,
        type: "appointment",
        linkId: String(appointment._id),
      }).catch(() => {});
    }

    await logAuditEvent({
      req,
      action: "APPOINTMENT_CREATED",
      resource: "Appointment",
      resourceId: appointment._id,
      details: { doctorName: appointment.doctorName, date: appointment.appointmentDate },
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to book appointment.",
      code: "APPOINTMENT_BOOK_ERROR",
    });
  }
};

// Get My Appointments (Scoped strictly to authenticated user)
export const getMyAppointments = async (req, res) => {
  try {
    const { status, search, mode } = req.query;
    const userId = req.user._id;
    const role = req.user.role;

    let query = {};

    if (role === "admin") {
      // Admins see all unless filtered
    } else if (role === "doctor") {
      query = {
        $or: [
          { doctor: userId },
          { doctorName: { $regex: req.user.name || "", $options: "i" } },
        ],
      };
    } else {
      // Patients see only their own
      query = { patient: userId };
    }

    if (status && status !== "All") {
      if (status === "Upcoming") {
        query.status = { $in: ["Confirmed", "Pending"] };
      } else {
        query.status = status;
      }
    }

    if (mode && mode !== "All") {
      query.mode = mode;
    }

    let appointments = await Appointment.find(query)
      .populate("patient", "name email phone patientId")
      .sort({ appointmentDate: 1, createdAt: -1 });

    if (search && search.trim() !== "") {
      const s = search.toLowerCase();
      appointments = appointments.filter(
        (a) =>
          a.doctorName?.toLowerCase().includes(s) ||
          a.specialization?.toLowerCase().includes(s) ||
          a.hospital?.toLowerCase().includes(s) ||
          a.patient?.name?.toLowerCase().includes(s)
      );
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch appointments.",
      code: "APPOINTMENTS_FETCH_ERROR",
    });
  }
};

// Get Single Appointment By ID (Ownership Checked)
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("patient", "name email phone patientId bloodGroup address");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
        code: "APPOINTMENT_NOT_FOUND",
      });
    }

    const userId = String(req.user._id);
    const isPatientOwner = appointment.patient && String(appointment.patient._id || appointment.patient) === userId;
    const isDoctorAssigned = appointment.doctor && String(appointment.doctor) === userId;
    const isAdminUser = req.user.role === "admin";

    if (!isPatientOwner && !isDoctorAssigned && !isAdminUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this appointment.",
        code: "UNAUTHORIZED_APPOINTMENT_ACCESS",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch appointment.",
      code: "APPOINTMENT_FETCH_ERROR",
    });
  }
};

// Reschedule Appointment (Ownership Checked)
export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
        code: "APPOINTMENT_NOT_FOUND",
      });
    }

    const userId = String(req.user._id);
    const isPatientOwner = String(appointment.patient) === userId;
    const isDoctorAssigned = appointment.doctor && String(appointment.doctor) === userId;
    const isAdminUser = req.user.role === "admin";

    if (!isPatientOwner && !isDoctorAssigned && !isAdminUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reschedule this appointment.",
        code: "UNAUTHORIZED_RESCHEDULE",
      });
    }

    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    appointment.status = "Confirmed";

    await appointment.save();

    await Notification.create({
      user: appointment.patient,
      title: "Appointment Rescheduled",
      message: `Your appointment with ${appointment.doctorName} was rescheduled to ${appointment.appointmentDate} at ${appointment.appointmentTime}.`,
      type: "appointment",
      linkId: String(appointment._id),
    });

    await logAuditEvent({
      req,
      action: "APPOINTMENT_RESCHEDULED",
      resource: "Appointment",
      resourceId: appointment._id,
      details: { newDate: appointment.appointmentDate, newTime: appointment.appointmentTime },
    });

    res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully.",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reschedule appointment.",
      code: "APPOINTMENT_RESCHEDULE_ERROR",
    });
  }
};

// Cancel Appointment (Ownership Checked)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
        code: "APPOINTMENT_NOT_FOUND",
      });
    }

    const userId = String(req.user._id);
    const isPatientOwner = String(appointment.patient) === userId;
    const isDoctorAssigned = appointment.doctor && String(appointment.doctor) === userId;
    const isAdminUser = req.user.role === "admin";

    if (!isPatientOwner && !isDoctorAssigned && !isAdminUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this appointment.",
        code: "UNAUTHORIZED_CANCELLATION",
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    await Notification.create({
      user: appointment.patient,
      title: "Appointment Cancelled",
      message: `Your appointment with ${appointment.doctorName} for ${appointment.appointmentDate} has been cancelled.`,
      type: "appointment",
      linkId: String(appointment._id),
    });

    await logAuditEvent({
      req,
      action: "APPOINTMENT_CANCELLED",
      resource: "Appointment",
      resourceId: appointment._id,
    });

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel appointment.",
      code: "APPOINTMENT_CANCEL_ERROR",
    });
  }
};

// Update Appointment Status (Doctor or Admin: Confirm / Complete / Cancel)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
        code: "APPOINTMENT_NOT_FOUND",
      });
    }

    const userId = String(req.user._id);
    const isDoctorAssigned = appointment.doctor && String(appointment.doctor) === userId;
    const isAdminUser = req.user.role === "admin";

    if (!isDoctorAssigned && !isAdminUser) {
      return res.status(403).json({
        success: false,
        message: "Only the assigned doctor or administrator can change appointment status.",
        code: "UNAUTHORIZED_STATUS_UPDATE",
      });
    }

    appointment.status = status || appointment.status;
    await appointment.save();

    await Notification.create({
      user: appointment.patient,
      title: `Appointment Status: ${appointment.status}`,
      message: `Your appointment with ${appointment.doctorName} on ${appointment.appointmentDate} is now marked as ${appointment.status}.`,
      type: "appointment",
      linkId: String(appointment._id),
    });

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${appointment.status}`,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "APPOINTMENT_STATUS_ERROR",
    });
  }
};

// Get Doctor Appointments (Protected - Doctor or Admin)
export const getDoctorAppointments = async (req, res) => {
  try {
    const requestedDoctorId = req.params.doctorId || req.user._id;

    if (req.user.role !== "admin" && String(req.user._id) !== String(requestedDoctorId)) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own doctor appointments.",
        code: "UNAUTHORIZED_DOCTOR_ACCESS",
      });
    }

    const appointments = await Appointment.find({
      $or: [
        { doctor: requestedDoctorId },
        { doctorName: { $regex: req.user.name || "", $options: "i" } },
      ],
    })
      .populate("patient", "name email phone patientId bloodGroup")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch doctor appointments.",
      code: "DOCTOR_APPOINTMENTS_ERROR",
    });
  }
};

// Get All Appointments (Admin Only)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email phone patientId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "ALL_APPOINTMENTS_ERROR",
    });
  }
};
