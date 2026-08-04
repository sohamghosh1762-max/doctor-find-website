import Notification from "../models/Notification.js";
import User from "../models/User.js";

// Create Notification
export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);

    res.status(201).json({
      success: true,
      message: "Notification created",
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get My Notifications
export const getMyNotifications = async (req, res) => {
  try {
    let userId = req.user?._id;
    if (!userId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      userId = defaultUser?._id;
    }

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter(n => !n.read).length;

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark as Read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === "all") {
      let userId = req.user?._id;
      if (!userId) {
        const defaultUser = await User.findOne({ email: "rahul@example.com" });
        userId = defaultUser?._id;
      }
      await Notification.updateMany({ user: userId }, { read: true });
      return res.status(200).json({ success: true, message: "All notifications marked as read" });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Marked as read",
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === "all") {
      let userId = req.user?._id;
      if (!userId) {
        const defaultUser = await User.findOne({ email: "rahul@example.com" });
        userId = defaultUser?._id;
      }
      await Notification.deleteMany({ user: userId });
      return res.status(200).json({ success: true, message: "All notifications cleared" });
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};