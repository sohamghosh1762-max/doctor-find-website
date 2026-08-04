import MedicalHistory from "../models/MedicalHistory.js";
import User from "../models/User.js";

// Create or Get My Medical History
export const getMyMedicalHistory = async (req, res) => {
  try {
    let patientId = req.user?._id;
    if (!patientId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      patientId = defaultUser?._id;
    }

    let history = await MedicalHistory.findOne({ patient: patientId });

    if (!history) {
      history = await MedicalHistory.create({
        patient: patientId,
        bloodGroup: "O+",
        allergies: ["Penicillin"],
        chronicDiseases: ["Mild Hypertension"],
        currentMedications: ["Amlodipine 5mg"],
        timeline: [
          {
            year: 2026,
            date: "15 July 2026",
            title: "Cardiovascular Checkup & Hypertension Management",
            type: "Checkup",
            diagnosis: "Mild Essential Hypertension",
            doctor: "Dr. Ananya Sharma",
            hospital: "Apollo Gleneagles Hospital",
            treatment: "Dietary sodium restriction & daily Amlodipine 5mg",
            reports: ["Comprehensive Blood Panel"],
            prescriptions: ["Amlodipine 5mg", "Telmisartan 40mg"]
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const addTimelineEntry = async (req, res) => {
  try {
    let patientId = req.user?._id;
    if (!patientId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      patientId = defaultUser?._id;
    }

    let history = await MedicalHistory.findOne({ patient: patientId });
    if (!history) {
      history = await MedicalHistory.create({ patient: patientId, timeline: [] });
    }

    history.timeline.push(req.body);
    await history.save();

    res.status(201).json({
      success: true,
      message: "Timeline entry added successfully",
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateMedicalHistory = async (req, res) => {
  try {
    let patientId = req.user?._id;
    if (!patientId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      patientId = defaultUser?._id;
    }

    const history = await MedicalHistory.findOneAndUpdate(
      { patient: patientId },
      req.body,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Medical history updated successfully",
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};