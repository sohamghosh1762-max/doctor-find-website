import express from "express";
import {
  getPatientDashboard,
  getPatientProfile,
  updatePatientProfile,
  changePassword,
  globalSearch
} from "../controllers/patientController.js";

const router = express.Router();

router.get("/dashboard", getPatientDashboard);
router.get("/profile", getPatientProfile);
router.put("/profile", updatePatientProfile);
router.post("/change-password", changePassword);
router.get("/search", globalSearch);

export default router;
