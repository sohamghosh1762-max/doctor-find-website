import express from "express";
import {
  addPharmacy,
  getAllPharmacies,
  getPharmacyById,
  updatePharmacy,
  deletePharmacy,
} from "../controllers/pharmacyController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllPharmacies);
router.get("/:id", getPharmacyById);

router.post("/", protect, isAdmin, addPharmacy);
router.put("/:id", protect, isAdmin, updatePharmacy);
router.delete("/:id", protect, isAdmin, deletePharmacy);

export default router;