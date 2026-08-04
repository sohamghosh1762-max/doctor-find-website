import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    specialization: {
      type: String
    },

    latitude: {
      type: Number
    },

    longitude: {
      type: Number
    },

    emergencyAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Hospital",
  hospitalSchema
);