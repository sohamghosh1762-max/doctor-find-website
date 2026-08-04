import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import pharmacyRoutes from "./routes/pharmacyRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import medicalHistoryRoutes from "./routes/medicalHistoryRoutes.js";
import nearbyRoutes from "./routes/nearbyRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import googlePlacesRoutes from "./routes/googlePlacesRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DoctorFind Healthcare Portal API Running"
  });
});

// Patient Routes
app.use("/api/patient", patientRoutes);

// Auth Routes
app.use("/api/auth", authRoutes);

// Core Entity Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/medical-history", medicalHistoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/nearby", nearbyRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/google-places", googlePlacesRoutes);
app.use("/api/availability", availabilityRoutes);

app.use("/uploads", express.static("uploads"));

export default app;