import express from "express";
import {
  getMyMedicalHistory,
  addTimelineEntry,
  updateMedicalHistory
} from "../controllers/medicalHistoryController.js";

const router = express.Router();

router.get("/", getMyMedicalHistory);
router.get("/me", getMyMedicalHistory);
router.post("/timeline", addTimelineEntry);
router.post("/", addTimelineEntry);
router.put("/", updateMedicalHistory);

export default router;