import Hospital from "../models/Hospital.js";
import Activity from "../models/Activity.js";
// Add Hospital
export const addHospital = async (
  req,
  res
) => {
  try {
    const hospital = await Hospital.create(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Hospital added successfully",
      hospital
    });

    
await Activity.create({
  title: `New hospital ${hospital.name} added`,
  type: "hospital",
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Hospitals
export const getAllHospitals = async (
  req,
  res
) => {
  try {
    const hospitals =
      await Hospital.find();

    res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Hospital
export const updateHospital = async (
  req,
  res
) => {
  try {
    const hospital =
      await Hospital.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Hospital updated",
      hospital
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Hospital
export const deleteHospital = async (
  req,
  res
) => {
  try {
    const hospital =
      await Hospital.findByIdAndDelete(
        req.params.id
      );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Hospital deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
