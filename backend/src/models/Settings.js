import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: "DoctorFind AI",
    },

    supportEmail: {
      type: String,
      default: "support@doctorfindai.com",
    },

    supportPhone: {
      type: String,
      default: "+91 9876543210",
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    allowRegistrations: {
      type: Boolean,
      default: true,
    },

    doctorVerification: {
      type: Boolean,
      default: true,
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Settings",
  settingsSchema
);