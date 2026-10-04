import mongoose from "mongoose";

const symptomAnalysisSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    symptomsText: {
      type: String,
      required: true,
    },
    possibleConditions: [
      {
        condition: String,
        relevance: {
          type: String,
          enum: ["High Concern", "Moderate Concern", "Low Concern", "Informational"],
          default: "Moderate Concern",
        },
        description: String,
      },
    ],
    severity: {
      type: String,
      enum: ["Mild", "Moderate", "High", "Critical", "Emergency"],
      default: "Moderate",
    },
    recommendations: [String],
    suggestedSpecialist: {
      type: String,
      default: "General Physician",
    },
    urgencyLevel: {
      type: String,
      default: "Consult within 24-48 hours",
    },
    suggestedTests: [String],
    nearbyDoctors: [
      {
        name: String,
        specialty: String,
        rating: Number,
        hospital: String,
      },
    ],
    disclaimer: {
      type: String,
      default:
        "This AI-assisted symptom assessment is for preliminary informational purposes only and does NOT constitute a medical diagnosis or treatment plan. If you are experiencing chest pain, severe bleeding, or difficulty breathing, seek immediate emergency medical care.",
    },
  },
  {
    timestamps: true,
  }
);

symptomAnalysisSchema.index({ patientId: 1, createdAt: -1 });

export default mongoose.model("SymptomAnalysis", symptomAnalysisSchema);
