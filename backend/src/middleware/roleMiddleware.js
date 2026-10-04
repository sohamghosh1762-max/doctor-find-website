export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "UNAUTHORIZED",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Requires one of roles: [${roles.join(", ")}]`,
        code: "FORBIDDEN",
      });
    }

    next();
  };
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      code: "UNAUTHORIZED",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Administrator privileges required.",
      code: "ADMIN_FORBIDDEN",
    });
  }

  next();
};

export const isDoctor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      code: "UNAUTHORIZED",
    });
  }

  if (req.user.role !== "doctor") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Doctor access required.",
      code: "DOCTOR_FORBIDDEN",
    });
  }

  next();
};

export const isPatient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      code: "UNAUTHORIZED",
    });
  }

  if (req.user.role !== "patient") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Patient access required.",
      code: "PATIENT_FORBIDDEN",
    });
  }

  next();
};

export const isDoctorOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      code: "UNAUTHORIZED",
    });
  }

  if (!["doctor", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Healthcare provider or Administrator access required.",
      code: "PROVIDER_FORBIDDEN",
    });
  }

  next();
};

export default {
  requireRole,
  isAdmin,
  isDoctor,
  isPatient,
  isDoctorOrAdmin,
};