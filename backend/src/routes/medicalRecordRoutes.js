import express from "express";
import {
  uploadMedicalRecord,
  getMyMedicalRecords,
  getMedicalRecordById,
  deleteMedicalRecord,
  getSecureRecordFile,
} from "../controllers/medicalRecordController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", uploadMedicalRecord);
router.get("/", getMyMedicalRecords);
router.get("/:id", getMedicalRecordById);
router.get("/:id/file", getSecureRecordFile);
router.delete("/:id", deleteMedicalRecord);

export default router;
