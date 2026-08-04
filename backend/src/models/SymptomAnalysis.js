import mongoose from "mongoose";

const symptomAnalysisSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    symptomsText: {
      type: String,
      required: true
    },
    possibleConditions: [
      {
        condition: String,
        probability: String,
        description: String
      }
    ],
    severity: {
      type: String,
      enum: ["Mild", "Moderate", "High", "Critical"],
      default: "Moderate"
    },
    recommendations: [String],
    suggestedSpecialist: {
      type: String,
      default: "General Physician"
    },
    urgencyLevel: {
      type: String,
      default: "Consult within 24-48 hours"
    },
    suggestedTests: [String],
    nearbyDoctors: [
      {
        name: String,
        specialty: String,
        rating: Number,
        hospital: String
      }
    ],
    disclaimer: {
      type: String,
      default: "This AI Symptom Analysis is for informational purposes only and does not replace professional medical advice or diagnosis."
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("SymptomAnalysis", symptomAnalysisSchema);
