import AuditLog from "../models/AuditLog.js";

/**
 * Log sensitive healthcare and authorization events.
 * Strips any sensitive passwords or tokens before saving.
 */
export const logAuditEvent = async ({
  req,
  userId = null,
  userEmail = "",
  role = "guest",
  action,
  resource,
  resourceId = "",
  status = "SUCCESS",
  details = {},
}) => {
  try {
    const ip = req?.ip || req?.headers?.["x-forwarded-for"] || req?.socket?.remoteAddress || "";
    const userAgent = req?.headers?.["user-agent"] || "";

    const finalUserId = userId || req?.user?._id || null;
    const finalEmail = userEmail || req?.user?.email || "";
    const finalRole = role !== "guest" ? role : req?.user?.role || "guest";

    // Sanitize details to avoid logging passwords or private credentials
    const sanitizedDetails = { ...details };
    delete sanitizedDetails.password;
    delete sanitizedDetails.token;
    delete sanitizedDetails.secret;

    await AuditLog.create({
      userId: finalUserId,
      userEmail: finalEmail,
      role: finalRole,
      action,
      resource,
      resourceId: String(resourceId || ""),
      ip: String(ip).slice(0, 100),
      userAgent: String(userAgent).slice(0, 255),
      status,
      details: sanitizedDetails,
    });
  } catch (error) {
    // Fail-safe: auditing failure shouldn't crash the request
    console.error("Audit logging error:", error.message);
  }
};

export default {
  logAuditEvent,
};
