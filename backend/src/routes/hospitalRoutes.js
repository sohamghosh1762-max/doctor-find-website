import express from "express";

import {
  addHospital,
  getAllHospitals,
  updateHospital,
  deleteHospital
} from "../controllers/hospitalController.js";

const router = express.Router();

router.post("/", addHospital);

router.get("/", getAllHospitals);

router.put(
  "/:id",
  updateHospital
);

router.delete(
  "/:id",
  deleteHospital
);

export default router;