import Notification from "../models/Notification.js";

/**
 * Notification Service Helper
 */
export const createUserNotification = async ({
  userId,
  title,
  message,
  type = "system",
  linkId = "",
}) => {
  try {
    if (!userId) return null;
    return await Notification.create({
      user: userId,
      title,
      message,
      type,
      linkId: String(linkId || ""),
    });
  } catch (error) {
    console.error("Notification service error:", error.message);
    return null;
  }
};

export default {
  createUserNotification,
};
