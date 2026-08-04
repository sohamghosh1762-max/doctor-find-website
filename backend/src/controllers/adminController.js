import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Medicine from "../models/Medicine.js";
import Hospital from "../models/Hospital.js";

export const getDashboardStats = async (
  req,
  res
) => {
  try {
    const users = await User.countDocuments();

    const doctors =
      await Doctor.countDocuments();

    const appointments =
      await Appointment.countDocuments();

    const medicines =
      await Medicine.countDocuments();

    const hospitals =
      await Hospital.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        users,
        doctors,
        appointments,
        medicines,
        hospitals
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMonthlyAppointments = async (
  req,
  res
) => {
  try {
    const data = await Appointment.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt"
            }
          },
          total: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.month": 1
        }
      }
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const result = months.map(
      (month, index) => ({
        month,
        appointments: 0
      })
    );

    data.forEach((item) => {
      result[item._id.month - 1]
        .appointments = item.total;
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};