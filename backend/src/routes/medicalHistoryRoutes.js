import express from "express";
import {
  getMyMedicalHistory,
  addTimelineEntry,
  updateMedicalHistory,
} from "../controllers/medicalHistoryController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyMedicalHistory);
router.get("/me", getMyMedicalHistory);
router.post("/timeline", addTimelineEntry);
router.post("/", addTimelineEntry);
router.put("/", updateMedicalHistory);

export default router;