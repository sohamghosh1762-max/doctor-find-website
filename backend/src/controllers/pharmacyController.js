import Pharmacy from "../models/Pharmacy.js";

// Add Pharmacy
export const addPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.create(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Pharmacy added successfully",
      pharmacy
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Pharmacies
export const getAllPharmacies = async (
  req,
  res
) => {
  try {
    const pharmacies =
      await Pharmacy.find();

    res.status(200).json({
      success: true,
      count: pharmacies.length,
      pharmacies
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Pharmacy By ID
export const getPharmacyById = async (
  req,
  res
) => {
  try {
    const pharmacy =
      await Pharmacy.findById(
        req.params.id
      );

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found"
      });
    }

    res.status(200).json({
      success: true,
      pharmacy
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};