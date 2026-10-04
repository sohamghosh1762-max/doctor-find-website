import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Lab Report", "Radiology", "X-Ray", "Blood Test", "MRI", "CT Scan", "Prescription", "Discharge Summary", "Other"],
      default: "Lab Report",
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String, // PDF, PNG, JPEG, DICOM
      default: "PDF",
    },
    dateUploaded: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    doctorName: {
      type: String,
      default: "Dr. Ananya Sharma",
    },
    hospitalName: {
      type: String,
      default: "Apollo Gleneagles Hospital",
    },
    notes: {
      type: String,
      default: "",
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

medicalRecordSchema.index({ patientId: 1, createdAt: -1 });

export default mongoose.model("MedicalRecord", medicalRecordSchema);
