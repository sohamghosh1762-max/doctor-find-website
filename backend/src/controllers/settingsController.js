import Settings from "../models/Settings.js";

// Get Settings
export const getSettings = async (
  req,
  res
) => {
  try {
    let settings =
      await Settings.findOne();

    if (!settings) {
      settings =
        await Settings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Settings
export const updateSettings = async (
  req,
  res
) => {
  try {
    let settings =
      await Settings.findOne();

    if (!settings) {
      settings =
        await Settings.create({});
    }

    settings =
      await Settings.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Settings Updated Successfully",
      settings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};