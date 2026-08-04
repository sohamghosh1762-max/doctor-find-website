import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      default: () => "PAT-" + Math.floor(100000 + Math.random() * 900000)
    },
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    phone: {
      type: String,
      default: "+91 98765 43210"
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient"
    },

    profileImage: {
      type: String,
      default: ""
    },

    gender: {
      type: String,
      default: "Male"
    },

    dateOfBirth: {
      type: String,
      default: "1995-08-15"
    },

    bloodGroup: {
      type: String,
      default: "O+"
    },

    address: {
      type: String,
      default: "72/A Park Street, Flat 4B, Kolkata, West Bengal 700016"
    },

    city: {
      type: String,
      default: "Kolkata"
    },

    state: {
      type: String,
      default: "West Bengal"
    },

    pincode: {
      type: String,
      default: "700016"
    },

    height: {
      type: Number,
      default: 175 // cm
    },

    weight: {
      type: Number,
      default: 70 // kg
    },

    emergencyContact: {
      name: { type: String, default: "Sunita Verma" },
      relationship: { type: String, default: "Mother" },
      phone: { type: String, default: "+91 98765 99999" }
    },

    insurance: {
      provider: { type: String, default: "Star Health Insurance" },
      policyNumber: { type: String, default: "SH-987214-X" },
      coverage: { type: String, default: "₹5,00,000" },
      expiry: { type: String, default: "2027-12-31" }
    },

    medicalConditions: {
      type: [String],
      default: ["Mild Hypertension", "Seasonal Asthma"]
    },

    allergies: {
      type: [String],
      default: ["Penicillin", "Dust Mites"]
    },

    currentMedications: {
      type: [String],
      default: ["Amlodipine 5mg", "Montair LC"]
    },

    preferredHospital: {
      type: String,
      default: "Apollo Gleneagles Hospital"
    },

    preferredDoctor: {
      type: String,
      default: "Dr. Ananya Sharma"
    },

    isVerified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "User",
  userSchema
);