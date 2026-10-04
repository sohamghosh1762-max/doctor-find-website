import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

// Rate limiting & Error Handling
import { generalLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Routes
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
import emergencyRoutes from "./routes/emergencyRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Trust proxy if running behind reverse proxy / load balancer
app.set("trust proxy", 1);

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Let frontend control CSP without breaking map tiles / Google APIs
  })
);

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: origin not allowed."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request Parsing & Logging
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// General API Rate Limiting
app.use("/api", generalLimiter);

// Health Check / Root
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DoctorFind Healthcare Portal API Running",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
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
app.use("/api/emergency", emergencyRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);

// Static uploads with disabled execution
app.use(
  "/uploads",
  express.static("uploads", {
    dotfiles: "ignore",
    index: false,
  })
);

// Centralized 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;