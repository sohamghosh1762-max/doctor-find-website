import Notification from "../models/Notification.js";

// Get My Notifications (Protected - strictly scoped to req.user._id)
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter((n) => !n.read).length;

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notifications.",
      code: "NOTIFICATIONS_FETCH_ERROR",
    });
  }
};

// Mark Notification as Read (Ownership Checked)
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (id === "all") {
      await Notification.updateMany({ user: userId }, { read: true });
      return res.status(200).json({
        success: true,
        message: "All notifications marked as read.",
      });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
        code: "NOTIFICATION_NOT_FOUND",
      });
    }

    if (String(notification.user) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own notifications.",
        code: "UNAUTHORIZED_NOTIFICATION_UPDATE",
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "NOTIFICATION_MARK_ERROR",
    });
  }
};

// Delete Notification (Ownership Checked)
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (id === "all") {
      await Notification.deleteMany({ user: userId });
      return res.status(200).json({
        success: true,
        message: "All notifications cleared.",
      });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
        code: "NOTIFICATION_NOT_FOUND",
      });
    }

    if (String(notification.user) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own notifications.",
        code: "UNAUTHORIZED_NOTIFICATION_DELETE",
      });
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "NOTIFICATION_DELETE_ERROR",
    });
  }
};