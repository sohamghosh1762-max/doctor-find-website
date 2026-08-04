import Prescription from "../models/Prescription.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// Create Prescription
export const createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get My Prescriptions (with status filter & search)
export const getMyPrescriptions = async (req, res) => {
  try {
    let patientId = req.user?._id;
    if (!patientId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      patientId = defaultUser?._id;
    }

    const { status, search } = req.query;
    let query = { patient: patientId };

    if (status && status !== "All") {
      query.status = status;
    }

    let prescriptions = await Prescription.find(query).sort({ date: -1 });

    if (search && search.trim() !== "") {
      const s = search.toLowerCase();
      prescriptions = prescriptions.filter(p =>
        p.prescribingDoctor.toLowerCase().includes(s) ||
        p.hospital.toLowerCase().includes(s) ||
        p.medicines.some(m => m.name.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Prescription By ID
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }

    res.status(200).json({
      success: true,
      prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Request Prescription Refill
export const requestPrescriptionRefill = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }

    prescription.refillStatus = "Requested";
    await prescription.save();

    await Notification.create({
      user: prescription.patient,
      title: "Prescription Refill Requested",
      message: `Your refill request for prescription issued by ${prescription.prescribingDoctor} has been sent to the clinic.`,
      type: "prescription",
      linkId: prescription._id
    });

    res.status(200).json({
      success: true,
      message: "Refill request submitted successfully",
      prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};