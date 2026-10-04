import express from "express";
import {
  addMedicine,
  getAllMedicines,
  searchMedicine,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicineController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllMedicines);
router.get("/search", searchMedicine);
router.get("/:id", getMedicineById);

router.post("/", protect, isAdmin, addMedicine);
router.put("/:id", protect, isAdmin, updateMedicine);
router.delete("/:id", protect, isAdmin, deleteMedicine);

export default router;