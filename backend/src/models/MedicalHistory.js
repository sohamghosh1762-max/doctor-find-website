import mongoose from "mongoose";

const timelineEntrySchema = new mongoose.Schema({
  year: { type: Number, required: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["Diagnosis", "Treatment", "Operation", "Vaccination", "Checkup", "Prescription", "Report"],
    default: "Diagnosis"
  },
  diagnosis: { type: String, default: "" },
  doctor: { type: String, default: "Dr. Ananya Sharma" },
  hospital: { type: String, default: "Apollo Gleneagles Hospital" },
  treatment: { type: String, default: "" },
  reports: [String],
  prescriptions: [String],
  operations: { type: String, default: "" },
  vaccinations: { type: String, default: "" },
  notes: { type: String, default: "" }
});

const medicalHistorySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bloodGroup: {
      type: String,
      default: "O+"
    },
    allergies: [String],
    chronicDiseases: [String],
    currentMedications: [String],
    pastSurgeries: [String],
    timeline: [timelineEntrySchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("MedicalHistory", medicalHistorySchema);