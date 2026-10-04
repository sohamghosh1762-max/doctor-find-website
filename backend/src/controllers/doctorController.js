import crypto from "crypto";
import Doctor from "../models/Doctor.js";
import Activity from "../models/Activity.js";
import generateDoctorToken from "../utils/generateDoctorToken.js";
import { logAuditEvent } from "../services/auditService.js";

// Add Doctor (Admin Only)
export const addDoctor = async (req, res) => {
  try {
    const { email, password, name, phone, specialization, hospital, location, qualification, experience, fees, licenseNumber, consultationMode, availabilitySlots, about } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const existingDoctor = await Doctor.findOne({ email: normalizedEmail });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "A doctor with this email is already registered.",
        code: "DOCTOR_EXISTS",
      });
    }

    // Secure temporary password generation if not supplied
    const initialPassword = password || crypto.randomBytes(6).toString("hex") + "A1!";

    const doctor = await Doctor.create({
      name,
      email: normalizedEmail,
      password: initialPassword,
      phone,
      specialization,
      qualification: qualification || "MBBS, MD",
      experience: experience || 5,
      hospital,
      fees: fees || 800,
      location,
      licenseNumber,
      consultationMode: consultationMode || "Both",
      availabilitySlots: availabilitySlots || [],
      about: about || "",
      verified: false,
    });

    await Activity.create({
      title: `New doctor ${doctor.name} registered`,
      type: "doctor",
    });

    await logAuditEvent({
      req,
      action: "DOCTOR_CREATED_BY_ADMIN",
      resource: "Doctor",
      resourceId: doctor._id,
      details: { doctorName: doctor.name, doctorEmail: doctor.email },
    });

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully.",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add doctor.",
      code: "DOCTOR_CREATE_ERROR",
    });
  }
};

// Get All Doctors (Public)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "DOCTORS_FETCH_ERROR",
    });
  }
};

// Get Doctor By ID (Public)
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
        code: "DOCTOR_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "DOCTOR_FETCH_ERROR",
    });
  }
};

// Search Doctors (Public)
export const searchDoctors = async (req, res) => {
  try {
    const { specialization, location, name } = req.query;
    const query = {};

    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    const doctors = await Doctor.find(query).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "DOCTOR_SEARCH_ERROR",
    });
  }
};

// Verify Doctor (Admin Only)
export const verifyDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
        code: "DOCTOR_NOT_FOUND",
      });
    }

    doctor.verified = true;
    await doctor.save();

    await logAuditEvent({
      req,
      action: "DOCTOR_VERIFIED_BY_ADMIN",
      resource: "Doctor",
      resourceId: doctor._id,
      details: { doctorName: doctor.name },
    });

    res.status(200).json({
      success: true,
      message: "Doctor verified successfully.",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "DOCTOR_VERIFY_ERROR",
    });
  }
};

// Update Availability (Doctor or Admin)
export const updateAvailability = async (req, res) => {
  try {
    const doctorId = req.params.id || req.user._id;

    // Authorization check: only the doctor or an admin can update slots
    if (req.user.role !== "admin" && String(req.user._id) !== String(doctorId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this doctor's availability slots.",
        code: "UNAUTHORIZED_SLOT_UPDATE",
      });
    }

    const slots = req.body.availabilitySlots || req.body.slots || [];
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { availabilitySlots: slots },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
        code: "DOCTOR_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      availabilitySlots: doctor.availabilitySlots,
      availability: doctor.availabilitySlots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "SLOT_UPDATE_ERROR",
    });
  }
};

// Get Availability (Public)
export const getAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
        code: "DOCTOR_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      availabilitySlots: doctor.availabilitySlots || [],
      availability: doctor.availabilitySlots || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "SLOT_FETCH_ERROR",
    });
  }
};

// Update Doctor (Admin or Doctor)
export const updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    if (req.user.role !== "admin" && String(req.user._id) !== String(doctorId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this doctor profile.",
        code: "UNAUTHORIZED_DOCTOR_UPDATE",
      });
    }

    const updates = { ...req.body };
    delete updates.password; // Do not update password here

    const doctor = await Doctor.findByIdAndUpdate(doctorId, updates, { new: true });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
        code: "DOCTOR_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor details updated successfully.",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "DOCTOR_UPDATE_ERROR",
    });
  }
};

// Delete Doctor (Admin Only)
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
        code: "DOCTOR_NOT_FOUND",
      });
    }

    await logAuditEvent({
      req,
      action: "DOCTOR_DELETED_BY_ADMIN",
      resource: "Doctor",
      resourceId: req.params.id,
      details: { doctorName: doctor.name },
    });

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "DOCTOR_DELETE_ERROR",
    });
  }
};

// Doctor Login
export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
        code: "MISSING_CREDENTIALS",
      });
    }

    const doctor = await Doctor.findOne({ email: email.toLowerCase().trim() });

    if (!doctor) {
      await logAuditEvent({
        req,
        userEmail: email,
        action: "DOCTOR_LOGIN_FAILED",
        resource: "DoctorAuth",
        status: "FAILED",
        details: { reason: "Doctor not found" },
      });

      return res.status(401).json({
        success: false,
        message: "Invalid doctor credentials.",
        code: "INVALID_CREDENTIALS",
      });
    }

    const isMatch = await doctor.matchPassword(password);

    if (!isMatch) {
      await logAuditEvent({
        req,
        userId: doctor._id,
        userEmail: doctor.email,
        role: "doctor",
        action: "DOCTOR_LOGIN_FAILED",
        resource: "DoctorAuth",
        status: "FAILED",
        details: { reason: "Password mismatch" },
      });

      return res.status(401).json({
        success: false,
        message: "Invalid doctor credentials.",
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = generateDoctorToken(doctor._id);

    await logAuditEvent({
      req,
      userId: doctor._id,
      userEmail: doctor.email,
      role: "doctor",
      action: "DOCTOR_LOGIN_SUCCESS",
      resource: "DoctorAuth",
      resourceId: doctor._id,
      status: "SUCCESS",
    });

    res.status(200).json({
      success: true,
      message: "Doctor login successful",
      token,
      doctor,
      mustChangePassword: !doctor.passwordChanged,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "DOCTOR_LOGIN_ERROR",
    });
  }
};

// Change Doctor Password (Protected)
export const changeDoctorPassword = async (req, res) => {
  try {
    const doctorId = req.params.id || req.user._id;

    if (req.user.role !== "admin" && String(req.user._id) !== String(doctorId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to change this doctor's password.",
        code: "UNAUTHORIZED_PASSWORD_CHANGE",
      });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
        code: "WEAK_PASSWORD",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
        code: "DOCTOR_NOT_FOUND",
      });
    }

    doctor.password = password;
    doctor.passwordChanged = true;
    await doctor.save();

    await logAuditEvent({
      req,
      userId: doctor._id,
      userEmail: doctor.email,
      role: "doctor",
      action: "DOCTOR_PASSWORD_CHANGED",
      resource: "Doctor",
      resourceId: doctor._id,
      status: "SUCCESS",
    });

    res.status(200).json({
      success: true,
      message: "Doctor password updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "PASSWORD_CHANGE_ERROR",
    });
  }
};