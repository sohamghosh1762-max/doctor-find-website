import Pharmacy from "../models/Pharmacy.js";

// Add Pharmacy (Admin Only)
export const addPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.create(req.body);

    res.status(201).json({
      success: true,
      message: "Pharmacy added successfully",
      pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add pharmacy.",
      code: "PHARMACY_ADD_ERROR",
    });
  }
};

// Get All Pharmacies (Public)
export const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pharmacies.length,
      pharmacies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "PHARMACIES_FETCH_ERROR",
    });
  }
};

// Get Pharmacy By ID (Public)
export const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
        code: "PHARMACY_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "PHARMACY_FETCH_ERROR",
    });
  }
};

// Update Pharmacy (Admin Only)
export const updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
        code: "PHARMACY_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pharmacy updated successfully",
      pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "PHARMACY_UPDATE_ERROR",
    });
  }
};

// Delete Pharmacy (Admin Only)
export const deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
        code: "PHARMACY_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pharmacy deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "PHARMACY_DELETE_ERROR",
    });
  }
};