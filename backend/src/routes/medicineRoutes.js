import express from "express";

import {
  addMedicine,
  getAllMedicines,
  searchMedicine,
  getMedicineById,
  updateMedicine,
  deleteMedicine
} from "../controllers/medicineController.js";

const router = express.Router();

router.post("/", addMedicine);

router.get("/", getAllMedicines);

router.get("/search", searchMedicine);

router.get("/:id", getMedicineById);

router.put(
  "/:id",
  updateMedicine
);

router.delete(
  "/:id",
  deleteMedicine
);

export default router;