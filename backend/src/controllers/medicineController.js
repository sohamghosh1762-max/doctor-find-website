import Medicine from "../models/Medicine.js";
import Activity from "../models/Activity.js";

// Add Medicine
export const addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      medicine
    });
    await Activity.create({
  title: `Medicine ${medicine.name} added`,
  type: "medicine",
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Medicines
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search Medicine
export const searchMedicine = async (req, res) => {
  try {
    const { name } = req.query;

    const medicines = await Medicine.find({
      name: {
        $regex: name,
        $options: "i"
      }
    });

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Medicine By ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(
      req.params.id
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.status(200).json({
      success: true,
      medicine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Medicine
export const updateMedicine = async (
  req,
  res
) => {
  try {
    const medicine =
      await Medicine.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine updated",
      medicine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Medicine
export const deleteMedicine = async (
  req,
  res
) => {
  try {
    const medicine =
      await Medicine.findByIdAndDelete(
        req.params.id
      );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

