import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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

    doctorName: {
      type: String,
      default: "Dr. Ananya Sharma"
    },

    doctorImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop"
    },

    specialization: {
      type: String,
      default: "Cardiologist"
    },

    hospital: {
      type: String,
      default: "Apollo Gleneagles Hospital"
    },

    appointmentDate: {
      type: String,
      required: true
    },

    appointmentTime: {
      type: String,
      required: true
    },

    mode: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online"
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Confirmed"
    },

    symptoms: {
      type: String,
      default: "Routine Health Checkup"
    },

    videoCallUrl: {
      type: String,
      default: "https://meet.jit.si/DoctorFindAI-Call-982"
    },

    consultationFee: {
      type: Number,
      default: 800
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Appointment", appointmentSchema);