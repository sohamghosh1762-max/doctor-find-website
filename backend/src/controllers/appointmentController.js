import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Notification from "../models/Notification.js";

// Book Appointment
export const bookAppointment = async (req, res) => {
  try {
    let patientId = req.user?._id;
    if (!patientId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      patientId = defaultUser?._id;
    }

    const {
      doctor,
      doctorName,
      doctorImage,
      specialization,
      hospital,
      appointmentDate,
      appointmentTime,
      mode,
      symptoms,
      consultationFee
    } = req.body;

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctor || null,
      doctorName: doctorName || "Dr. Ananya Sharma",
      doctorImage: doctorImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
      specialization: specialization || "Cardiologist",
      hospital: hospital || "Apollo Gleneagles Hospital",
      appointmentDate: appointmentDate || "2026-08-01",
      appointmentTime: appointmentTime || "10:30 AM",
      mode: mode || "Online",
      status: "Confirmed",
      symptoms: symptoms || "Routine consultation",
      videoCallUrl: mode === "Online" ? `https://meet.jit.si/DoctorFindAI-Call-${Math.floor(100 + Math.random() * 900)}` : "",
      consultationFee: consultationFee || 800
    });

    // Create Notification
    await Notification.create({
      user: patientId,
      title: "Appointment Booked Successfully",
      message: `Your ${mode} appointment with ${appointment.doctorName} is confirmed for ${appointment.appointmentDate} at ${appointment.appointmentTime}.`,
      type: "appointment",
      linkId: appointment._id
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get My Appointments (with filters)
export const getMyAppointments = async (req, res) => {
  try {
    let patientId = req.user?._id;
    if (!patientId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      patientId = defaultUser?._id;
    }

    const { status, search, mode } = req.query;
    let query = { patient: patientId };

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

    let appointments = await Appointment.find(query).sort({ appointmentDate: 1 });

    if (search && search.trim() !== "") {
      const s = search.toLowerCase();
      appointments = appointments.filter(a =>
        a.doctorName.toLowerCase().includes(s) ||
        a.specialization.toLowerCase().includes(s) ||
        a.hospital.toLowerCase().includes(s)
      );
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Appointment By ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reschedule Appointment
export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
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
      linkId: appointment._id
    });

    res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel Appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    await Notification.create({
      user: appointment.patient,
      title: "Appointment Cancelled",
      message: `Your appointment with ${appointment.doctorName} for ${appointment.appointmentDate} has been cancelled.`,
      type: "appointment",
      linkId: appointment._id
    });

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Appointments (Admin)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("patient");

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Doctor Appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    let query = {};

    if (doctorId && doctorId !== "undefined") {
      query = {
        $or: [
          { doctor: doctorId },
          { doctorName: { $regex: doctorId, $options: "i" } }
        ]
      };
    }

    const appointments = await Appointment.find(query).populate("patient").sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
