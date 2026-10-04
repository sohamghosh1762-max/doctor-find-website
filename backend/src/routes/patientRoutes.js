import express from "express";
import {
  getPatientDashboard,
  getPatientProfile,
  updatePatientProfile,
  changePassword,
  globalSearch,
} from "../controllers/patientController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getPatientDashboard);
router.get("/profile", getPatientProfile);
router.put("/profile", updatePatientProfile);
router.post("/change-password", changePassword);
router.get("/search", globalSearch);

export default router;
