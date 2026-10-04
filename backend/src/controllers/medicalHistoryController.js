import MedicalHistory from "../models/MedicalHistory.js";
import { logAuditEvent } from "../services/auditService.js";

// Get My Medical History (Protected - req.user._id)
export const getMyMedicalHistory = async (req, res) => {
  try {
    const patientId = req.user._id;

    let history = await MedicalHistory.findOne({ patient: patientId });

    if (!history) {
      history = await MedicalHistory.create({
        patient: patientId,
        bloodGroup: req.user.bloodGroup || "O+",
        allergies: req.user.allergies || ["None documented"],
        chronicDiseases: req.user.medicalConditions || ["None"],
        currentMedications: req.user.currentMedications || ["None"],
        timeline: [],
      });
    }

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch medical history.",
      code: "HISTORY_FETCH_ERROR",
    });
  }
};

// Add Timeline Entry (Protected)
export const addTimelineEntry = async (req, res) => {
  try {
    const patientId = req.user._id;

    let history = await MedicalHistory.findOne({ patient: patientId });
    if (!history) {
      history = await MedicalHistory.create({ patient: patientId, timeline: [] });
    }

    history.timeline.push(req.body);
    await history.save();

    await logAuditEvent({
      req,
      action: "TIMELINE_ENTRY_ADDED",
      resource: "MedicalHistory",
      resourceId: history._id,
    });

    res.status(201).json({
      success: true,
      message: "Timeline entry added successfully",
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add timeline entry.",
      code: "TIMELINE_ADD_ERROR",
    });
  }
};

// Update Medical History (Protected)
export const updateMedicalHistory = async (req, res) => {
  try {
    const patientId = req.user._id;

    const history = await MedicalHistory.findOneAndUpdate(
      { patient: patientId },
      req.body,
      { new: true, upsert: true }
    );

    await logAuditEvent({
      req,
      action: "MEDICAL_HISTORY_UPDATED",
      resource: "MedicalHistory",
      resourceId: history._id,
    });

    res.status(200).json({
      success: true,
      message: "Medical history updated successfully",
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update medical history.",
      code: "HISTORY_UPDATE_ERROR",
    });
  }
};