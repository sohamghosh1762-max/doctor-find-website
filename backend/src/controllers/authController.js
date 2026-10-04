import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { logAuditEvent } from "../services/auditService.js";

// ==========================
// Register User (PUBLIC - ALWAYS CREATES ROLE = PATIENT)
// ==========================
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      emergencyContact,
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      await logAuditEvent({
        req,
        userEmail: normalizedEmail,
        action: "USER_REGISTER_FAILED",
        resource: "User",
        status: "FAILED",
        details: { reason: "Email already registered" },
      });

      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
        code: "EMAIL_EXISTS",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // CRITICAL SECURITY FIX: Public registration MUST NEVER trust client-supplied role.
    // Public registration always assigns role: "patient".
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "+91 98765 43210",
      gender: gender || "Male",
      dateOfBirth: dateOfBirth || "1998-05-20",
      bloodGroup: bloodGroup || "O+",
      address: address || "City Center, Kolkata",
      role: "patient", // STRICTLY PATIENT
      emergencyContact: emergencyContact || {
        name: "Emergency Contact",
        relationship: "Family",
        phone: "+91 98765 00000",
      },
    });

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    await logAuditEvent({
      req,
      userId: user._id,
      userEmail: user.email,
      role: user.role,
      action: "USER_REGISTER_SUCCESS",
      resource: "User",
      resourceId: user._id,
      status: "SUCCESS",
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        _id: user._id,
        patientId: user.patientId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        bloodGroup: user.bloodGroup,
        address: user.address,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register user.",
      code: "REGISTER_ERROR",
    });
  }
};

// ==========================
// Login User (Patient / Admin / Doctor)
// ==========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check User model
    let user = await User.findOne({ email: normalizedEmail });
    let role = user ? user.role : "patient";
    let isDoctorAccount = false;

    // 2. Check Doctor model if not in User
    if (!user) {
      const doctor = await Doctor.findOne({ email: normalizedEmail });
      if (doctor) {
        user = doctor;
        role = "doctor";
        isDoctorAccount = true;
      }
    }

    if (!user) {
      await logAuditEvent({
        req,
        userEmail: normalizedEmail,
        action: "LOGIN_FAILED",
        resource: "Auth",
        status: "FAILED",
        details: { reason: "User not found" },
      });

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await logAuditEvent({
        req,
        userId: user._id,
        userEmail: normalizedEmail,
        role,
        action: "LOGIN_FAILED",
        resource: "Auth",
        status: "FAILED",
        details: { reason: "Password mismatch" },
      });

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Generate token
    const token = generateToken(user._id, role);

    await logAuditEvent({
      req,
      userId: user._id,
      userEmail: normalizedEmail,
      role,
      action: "LOGIN_SUCCESS",
      resource: "Auth",
      resourceId: user._id,
      status: "SUCCESS",
    });

    const sanitizedUser = isDoctorAccount
      ? {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: "doctor",
          specialization: user.specialization,
          hospital: user.hospital,
          profileImage: user.profileImage,
        }
      : {
          _id: user._id,
          patientId: user.patientId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          bloodGroup: user.bloodGroup,
          address: user.address,
          profileImage: user.profileImage,
        };

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Login failed.",
      code: "LOGIN_ERROR",
    });
  }
};

// ==========================
// Get Logged-in User Profile (Protected)
// ==========================
export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "PROFILE_ERROR",
    });
  }
};

// ==========================
// Get All Users (Admin Only)
// ==========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "USERS_FETCH_ERROR",
    });
  }
};