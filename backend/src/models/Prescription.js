import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    },

    prescribingDoctor: {
      type: String,
      default: "Dr. Ananya Sharma"
    },

    doctorSpecialty: {
      type: String,
      default: "Cardiologist"
    },

    hospital: {
      type: String,
      default: "Apollo Gleneagles Hospital"
    },

    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0]
    },

    status: {
      type: String,
      enum: ["Current", "Expired", "Completed"],
      default: "Current"
    },

    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, default: "650mg" },
        frequency: { type: String, default: "1-0-1" },
        duration: { type: String, default: "5 Days" },
        instructions: { type: String, default: "Take after meals" }
      }
    ],

    notes: {
      type: String,
      default: "Maintain low sodium diet & monitor blood pressure regularly."
    },

    refillStatus: {
      type: String,
      enum: ["None", "Requested", "Approved"],
      default: "None"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Prescription", prescriptionSchema);