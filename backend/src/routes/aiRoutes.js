import express from "express";
import {
  analyzeSymptoms,
  getSymptomHistory,
} from "../controllers/aiController.js";
import { optionalAuth, protect } from "../middleware/authMiddleware.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { validateSymptomAnalysis } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/symptom-analysis", aiLimiter, optionalAuth, validateSymptomAnalysis, analyzeSymptoms);
router.post("/analyze", aiLimiter, optionalAuth, validateSymptomAnalysis, analyzeSymptoms);
router.get("/history", protect, getSymptomHistory);

export default router;