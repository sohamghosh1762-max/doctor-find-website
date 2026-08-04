import Doctor from "../models/Doctor.js";

export const updateAvailability = async (
  req,
  res
) => {
  try {
    const doctor = await Doctor.findById(
      req.user._id
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    doctor.availabilitySlots =
      req.body.availabilitySlots;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Availability updated",
      availabilitySlots:
        doctor.availabilitySlots
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAvailability = async (
  req,
  res
) => {
  try {
    const doctor = await Doctor.findById(
      req.user._id
    );

    res.status(200).json({
      success: true,
      availabilitySlots:
        doctor.availabilitySlots
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};