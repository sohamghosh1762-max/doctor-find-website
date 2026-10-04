import Prescription from "../models/Prescription.js";
import Notification from "../models/Notification.js";
import { logAuditEvent } from "../services/auditService.js";

// Create Prescription (Doctor or Admin Only)
export const createPrescription = async (req, res) => {
  try {
    const { patient, medicines, doctorSpecialty, hospital, notes } = req.body;

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required to issue a prescription.",
        code: "MISSING_PATIENT",
      });
    }

    const prescription = await Prescription.create({
      patient,
      doctor: req.user.role === "doctor" ? req.user._id : req.body.doctor || null,
      prescribingDoctor: req.user.name || req.body.prescribingDoctor || "Dr. Treating Physician",
      doctorSpecialty: doctorSpecialty || req.user.specialization || "General Medicine",
      hospital: hospital || req.user.hospital || "Apollo Hospital",
      medicines: medicines || [],
      notes: notes || "",
    });

    await Notification.create({
      user: patient,
      title: "New Prescription Issued",
      message: `Dr. ${prescription.prescribingDoctor} has issued a new prescription for you.`,
      type: "prescription",
      linkId: String(prescription._id),
    });

    await logAuditEvent({
      req,
      action: "PRESCRIPTION_CREATED",
      resource: "Prescription",
      resourceId: prescription._id,
      details: { patientId: patient, doctor: prescription.prescribingDoctor },
    });

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create prescription.",
      code: "PRESCRIPTION_CREATE_ERROR",
    });
  }
};

// Get My Prescriptions (Scoped to authenticated patient/doctor)
export const getMyPrescriptions = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const { status, search } = req.query;

    let query = {};

    if (role === "admin") {
      // Admins see all unless filtered
    } else if (role === "doctor") {
      query = { doctor: userId };
    } else {
      query = { patient: userId };
    }

    if (status && status !== "All") {
      query.status = status;
    }

    let prescriptions = await Prescription.find(query).sort({ date: -1, createdAt: -1 });

    if (search && search.trim() !== "") {
      const s = search.toLowerCase();
      prescriptions = prescriptions.filter(
        (p) =>
          p.prescribingDoctor?.toLowerCase().includes(s) ||
          p.hospital?.toLowerCase().includes(s) ||
          p.medicines?.some((m) => m.name?.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch prescriptions.",
      code: "PRESCRIPTIONS_FETCH_ERROR",
    });
  }
};

// Get Prescription By ID (Ownership Checked)
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
        code: "PRESCRIPTION_NOT_FOUND",
      });
    }

    const userId = String(req.user._id);
    const isPatient = String(prescription.patient) === userId;
    const isDoctor = prescription.doctor && String(prescription.doctor) === userId;
    const isAdmin = req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this prescription.",
        code: "UNAUTHORIZED_PRESCRIPTION_ACCESS",
      });
    }

    res.status(200).json({
      success: true,
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "PRESCRIPTION_FETCH_ERROR",
    });
  }
};

// Request Prescription Refill (Patient Ownership Checked)
export const requestPrescriptionRefill = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
        code: "PRESCRIPTION_NOT_FOUND",
      });
    }

    const userId = String(req.user._id);
    const isPatient = String(prescription.patient) === userId;
    const isAdmin = req.user.role === "admin";

    if (!isPatient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only request refills for your own prescriptions.",
        code: "UNAUTHORIZED_REFILL_REQUEST",
      });
    }

    prescription.refillStatus = "Requested";
    await prescription.save();

    await Notification.create({
      user: prescription.patient,
      title: "Prescription Refill Requested",
      message: `Your refill request for prescription issued by ${prescription.prescribingDoctor} has been submitted.`,
      type: "prescription",
      linkId: String(prescription._id),
    });

    await logAuditEvent({
      req,
      action: "PRESCRIPTION_REFILL_REQUESTED",
      resource: "Prescription",
      resourceId: prescription._id,
    });

    res.status(200).json({
      success: true,
      message: "Refill request submitted successfully.",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to request refill.",
      code: "REFILL_REQUEST_ERROR",
    });
  }
};