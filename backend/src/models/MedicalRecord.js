import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["Lab Report", "Radiology", "X-Ray", "Blood Test", "MRI", "CT Scan", "Prescription", "Discharge Summary", "Other"],
      default: "Lab Report"
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String, // PDF, PNG, JPEG, DICOM
      default: "PDF"
    },
    dateUploaded: {
      type: String,
      default: () => new Date().toISOString().split("T")[0]
    },
    doctorName: {
      type: String,
      default: "Dr. Ananya Sharma"
    },
    hospitalName: {
      type: String,
      default: "Apollo Gleneagles Hospital"
    },
    notes: {
      type: String,
      default: ""
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("MedicalRecord", medicalRecordSchema);
