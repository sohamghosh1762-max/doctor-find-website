/**
 * Centralized backend request validation helpers
 */

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid name (at least 2 characters).",
      code: "INVALID_NAME",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
      code: "INVALID_EMAIL",
    });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long.",
      code: "WEAK_PASSWORD",
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password.",
      code: "MISSING_CREDENTIALS",
    });
  }

  next();
};

export const validateAppointment = (req, res, next) => {
  const { appointmentDate, appointmentTime } = req.body;

  if (!appointmentDate || !appointmentTime) {
    return res.status(400).json({
      success: false,
      message: "Appointment date and time are required.",
      code: "MISSING_APPOINTMENT_SLOT",
    });
  }

  next();
};

export const validateDoctorCreation = (req, res, next) => {
  const { name, email, specialization, hospital, location, licenseNumber, phone } = req.body;

  if (!name || !email || !specialization || !hospital || !location || !licenseNumber || !phone) {
    return res.status(400).json({
      success: false,
      message: "Required doctor fields: name, email, phone, specialization, hospital, location, licenseNumber.",
      code: "MISSING_DOCTOR_FIELDS",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid doctor email address.",
      code: "INVALID_EMAIL",
    });
  }

  next();
};

export const validateReview = (req, res, next) => {
  const { doctor, rating, comment } = req.body;

  if (!doctor) {
    return res.status(400).json({
      success: false,
      message: "Doctor ID is required for review.",
      code: "MISSING_DOCTOR_ID",
    });
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be a number between 1 and 5.",
      code: "INVALID_RATING",
    });
  }

  if (!comment || typeof comment !== "string" || comment.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Comment must be at least 3 characters.",
      code: "INVALID_COMMENT",
    });
  }

  next();
};

export const validateSymptomAnalysis = (req, res, next) => {
  const { symptoms } = req.body;

  if (!symptoms || typeof symptoms !== "string" || symptoms.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Please describe your symptoms in at least 3 characters.",
      code: "INVALID_SYMPTOMS_TEXT",
    });
  }

  next();
};

export default {
  validateRegister,
  validateLogin,
  validateAppointment,
  validateDoctorCreation,
  validateReview,
  validateSymptomAnalysis,
};
