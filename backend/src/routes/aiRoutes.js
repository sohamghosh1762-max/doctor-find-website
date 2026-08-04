import express from "express";
import {
  analyzeSymptoms,
  getSymptomHistory
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/symptoms", analyzeSymptoms);
router.post("/symptom-analysis", analyzeSymptoms);
router.get("/history", getSymptomHistory);

export default router;