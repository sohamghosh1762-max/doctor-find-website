import express from "express";
import {
  uploadMedicalRecord,
  getMyMedicalRecords,
  deleteMedicalRecord
} from "../controllers/medicalRecordController.js";

const router = express.Router();

router.post("/", uploadMedicalRecord);
router.get("/", getMyMedicalRecords);
router.delete("/:id", deleteMedicalRecord);

export default router;
