import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

/**
 * Protect middleware: Verifies JWT token and attaches authenticated user/doctor to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a valid Bearer token.",
        code: "UNAUTHORIZED",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_key_doctorfind_12345");

    // 1. Check User model (Patient / Admin)
    let user = await User.findById(decoded.id).select("-password");

    // 2. Check Doctor model if not in User
    if (!user) {
      const doctor = await Doctor.findById(decoded.id).select("-password");
      if (doctor) {
        user = doctor.toObject();
        user.role = "doctor";
        user._id = doctor._id;
        user.isDoctor = true;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User session expired or account not found.",
        code: "USER_NOT_FOUND",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      code: "INVALID_TOKEN",
    });
  }
};

/**
 * Optional authentication: attaches req.user if valid token provided, but doesn't block if absent.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_key_doctorfind_12345");
    let user = await User.findById(decoded.id).select("-password");
    if (!user) {
      const doctor = await Doctor.findById(decoded.id).select("-password");
      if (doctor) {
        user = doctor.toObject();
        user.role = "doctor";
        user._id = doctor._id;
      }
    }
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Silently proceed for optional auth
  }
  next();
};

export default protect;