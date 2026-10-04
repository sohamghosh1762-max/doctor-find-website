import express from "express";
import { createPaymentOrder, verifyPaymentSignature } from "../services/paymentService.js";
import protect from "../middleware/authMiddleware.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.use(protect);

// Create Order for Consultation Fee
router.post("/create-order", async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;
    const order = await createPaymentOrder({
      amount: amount || 800,
      receipt: `appt_${appointmentId}`,
      notes: { appointmentId, userId: String(req.user._id) },
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify Server-Side Payment Signature
router.post("/verify", async (req, res) => {
  try {
    const { orderId, paymentId, signature, appointmentId } = req.body;
    const isValid = verifyPaymentSignature({ orderId, paymentId, signature });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature verification failed",
      });
    }

    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { status: "Confirmed" });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
