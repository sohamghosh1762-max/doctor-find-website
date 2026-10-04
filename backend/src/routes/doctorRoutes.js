import express from "express";
import {
  addDoctor,
  getAllDoctors,
  getDoctorById,
  searchDoctors,
  verifyDoctor,
  updateAvailability,
  getAvailability,
  updateDoctor,
  deleteDoctor,
  doctorLogin,
  changeDoctorPassword,
} from "../controllers/doctorController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateDoctorCreation } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Public Doctor Discovery
router.get("/", getAllDoctors);
router.get("/search", searchDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/slots", getAvailability);

// Doctor Auth
router.post("/login", authLimiter, doctorLogin);
router.put("/change-password/:id", protect, changeDoctorPassword);

// Doctor Slot Management (Doctor or Admin)
router.put("/:id/slots", protect, updateAvailability);

// Admin-Only Doctor Operations
router.post("/", protect, isAdmin, validateDoctorCreation, addDoctor);
router.put("/verify/:id", protect, isAdmin, verifyDoctor);
router.put("/:id", protect, updateDoctor);
router.delete("/:id", protect, isAdmin, deleteDoctor);

export default router;