import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Medicine from "../models/Medicine.js";
import Hospital from "../models/Hospital.js";
import Pharmacy from "../models/Pharmacy.js";
import Review from "../models/Review.js";
import AuditLog from "../models/AuditLog.js";

// Admin Dashboard Summary Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [users, doctors, appointments, medicines, hospitals, pharmacies, reviews] = await Promise.all([
      User.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Medicine.countDocuments(),
      Hospital.countDocuments(),
      Pharmacy.countDocuments(),
      Review.countDocuments(),
    ]);

    const verifiedDoctors = await Doctor.countDocuments({ verified: true });
    const pendingAppointments = await Appointment.countDocuments({ status: "Pending" });
    const confirmedAppointments = await Appointment.countDocuments({ status: "Confirmed" });

    res.status(200).json({
      success: true,
      stats: {
        users,
        doctors,
        verifiedDoctors,
        appointments,
        pendingAppointments,
        confirmedAppointments,
        medicines,
        hospitals,
        pharmacies,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load admin statistics.",
      code: "ADMIN_STATS_ERROR",
    });
  }
};

// Monthly Appointments Aggregation
export const getMonthlyAppointments = async (req, res) => {
  try {
    const data = await Appointment.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const result = months.map((month) => ({
      month,
      appointments: 0,
    }));

    data.forEach((item) => {
      if (item._id && item._id.month && item._id.month >= 1 && item._id.month <= 12) {
        result[item._id.month - 1].appointments = item.total;
      }
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "MONTHLY_STATS_ERROR",
    });
  }
};

// Get Audit Logs (Admin Only)
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "AUDIT_LOGS_ERROR",
    });
  }
};