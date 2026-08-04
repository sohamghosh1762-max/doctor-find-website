import Activity from "../models/Activity.js";

export const getActivities =
  async (req, res) => {
    const activities =
      await Activity.find()
        .sort({ createdAt: -1 })
        .limit(10);

    res.json({
      success: true,
      activities,
    });
  };