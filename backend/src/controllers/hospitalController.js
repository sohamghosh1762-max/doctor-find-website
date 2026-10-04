import Hospital from "../models/Hospital.js";
import Activity from "../models/Activity.js";

// Add Hospital (Admin Only)
export const addHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);

    await Activity.create({
      title: `New hospital ${hospital.name} added`,
      type: "hospital",
    });

    res.status(201).json({
      success: true,
      message: "Hospital added successfully",
      hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add hospital.",
      code: "HOSPITAL_ADD_ERROR",
    });
  }
};

// Get All Hospitals (Public)
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "HOSPITALS_FETCH_ERROR",
    });
  }
};

// Update Hospital (Admin Only)
export const updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
        code: "HOSPITAL_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hospital updated successfully",
      hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "HOSPITAL_UPDATE_ERROR",
    });
  }
};

// Delete Hospital (Admin Only)
export const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
        code: "HOSPITAL_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hospital deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "HOSPITAL_DELETE_ERROR",
    });
  }
};
