import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";
import SymptomAnalysis from "../models/SymptomAnalysis.js";
import bcrypt from "bcryptjs";

// Calculate Dynamic Health Score
const calculateHealthScore = (patient) => {
  let score = 100;
  
  // BMI calculation (weight in kg / (height in m)^2)
  const heightM = (patient.height || 175) / 100;
  const weight = patient.weight || 70;
  const bmi = Number((weight / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5 || bmi > 24.9) {
    score -= 8;
  }
  if (bmi > 29.9) {
    score -= 7;
  }

  // Medical conditions impact
  const conditions = patient.medicalConditions || [];
  score -= conditions.length * 4;

  // Allergies impact
  const allergies = patient.allergies || [];
  score -= allergies.length * 2;

  // Ensure bounds
  score = Math.max(40, Math.min(100, score));

  let status = "Excellent";
  let color = "emerald";

  if (score >= 85) {
    status = "Excellent";
    color = "emerald";
  } else if (score >= 70) {
    status = "Good";
    color = "teal";
  } else if (score >= 55) {
    status = "Average";
    color = "amber";
  } else {
    status = "Needs Attention";
    color = "red";
  }

  return {
    score: `${score}/100`,
    numericScore: score,
    status,
    color,
    bmi,
    factors: {
      bmiStatus: bmi >= 18.5 && bmi <= 24.9 ? "Optimal" : "Requires attention",
      activeConditions: conditions.length,
      adherenceRate: "94%"
    }
  };
};

export const getPatientDashboard = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.patientId;
    let patient = await User.findById(userId);

    if (!patient) {
      // Fallback to default seeded patient Rahul Verma
      patient = await User.findOne({ email: "rahul@example.com" });
    }

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const patientObjectId = patient._id;

    // Counts
    const upcomingAppointmentsCount = await Appointment.countDocuments({
      patient: patientObjectId,
      status: { $in: ["Confirmed", "Pending"] }
    });

    const activePrescriptionsCount = await Prescription.countDocuments({
      patient: patientObjectId,
      status: "Current"
    });

    const medicalRecordsCount = await MedicalRecord.countDocuments({
      patientId: patientObjectId
    });

    const healthScore = calculateHealthScore(patient);

    // Upcoming appointments list (top 3)
    const upcomingAppointments = await Appointment.find({
      patient: patientObjectId,
      status: { $in: ["Confirmed", "Pending"] }
    }).sort({ appointmentDate: 1 }).limit(3);

    // Recent Prescriptions list
    const recentPrescriptions = await Prescription.find({
      patient: patientObjectId
    }).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      patient: {
        _id: patient._id,
        patientId: patient.patientId,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        profileImage: patient.profileImage,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth,
        bloodGroup: patient.bloodGroup,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        insurance: patient.insurance,
        medicalConditions: patient.medicalConditions,
        allergies: patient.allergies,
        currentMedications: patient.currentMedications,
        preferredHospital: patient.preferredHospital,
        preferredDoctor: patient.preferredDoctor
      },
      kpis: {
        upcomingAppointments: upcomingAppointmentsCount,
        activePrescriptions: activePrescriptionsCount,
        medicalRecords: medicalRecordsCount,
        healthScore
      },
      upcomingAppointments,
      recentPrescriptions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.patientId;
    let patient = await User.findById(userId);

    if (!patient) {
      patient = await User.findOne({ email: "rahul@example.com" });
    }

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    res.status(200).json({
      success: true,
      patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.body._id;
    let patient = await User.findById(userId);

    if (!patient) {
      patient = await User.findOne({ email: "rahul@example.com" });
    }

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const fields = [
      "name", "phone", "profileImage", "gender", "dateOfBirth",
      "bloodGroup", "address", "city", "state", "pincode",
      "height", "weight", "emergencyContact", "insurance",
      "medicalConditions", "allergies", "currentMedications",
      "preferredHospital", "preferredDoctor"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?._id;
    let patient = await User.findById(userId);

    if (!patient) {
      patient = await User.findOne({ email: "rahul@example.com" });
    }

    if (!patient) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (patient.password) {
      const isMatch = await bcrypt.compare(currentPassword, patient.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password does not match" });
      }
    }

    patient.password = await bcrypt.hash(newPassword, 10);
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const globalSearch = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(200).json({ success: true, results: [] });
    }

    const regex = new RegExp(query, "i");

    const [doctors, appointments, prescriptions, records] = await Promise.all([
      Doctor.find({ $or: [{ name: regex }, { specialty: regex }, { hospital: regex }] }).limit(4),
      Appointment.find({ $or: [{ doctorName: regex }, { specialization: regex }, { hospital: regex }, { symptoms: regex }] }).limit(4),
      Prescription.find({ $or: [{ prescribingDoctor: regex }, { hospital: regex }, { "medicines.name": regex }] }).limit(4),
      MedicalRecord.find({ $or: [{ title: regex }, { category: regex }, { doctorName: regex }] }).limit(4)
    ]);

    const formatted = [
      ...doctors.map(d => ({ type: "Doctor", title: d.name, subtitle: `${d.specialty} · ${d.hospital}`, id: d._id, link: `/doctors` })),
      ...appointments.map(a => ({ type: "Appointment", title: `Appt with ${a.doctorName}`, subtitle: `${a.appointmentDate} at ${a.appointmentTime}`, id: a._id, link: `/patient/appointments/${a._id}` })),
      ...prescriptions.map(p => ({ type: "Prescription", title: p.prescribingDoctor, subtitle: p.medicines.map(m => m.name).join(", "), id: p._id, link: `/patient/prescriptions` })),
      ...records.map(r => ({ type: "Medical Record", title: r.title, subtitle: `${r.category} · ${r.dateUploaded}`, id: r._id, link: `/patient/medical-records` }))
    ];

    res.status(200).json({
      success: true,
      results: formatted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
