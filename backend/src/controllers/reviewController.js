import Review from "../models/Review.js";
import Activity from "../models/Activity.js";
import Doctor from "../models/Doctor.js";
import { logAuditEvent } from "../services/auditService.js";

// Add Review (Protected - Patient Only)
export const addReview = async (req, res) => {
  try {
    const { doctor, rating, comment } = req.body;
    const patientId = req.user._id;

    const review = await Review.create({
      patient: patientId,
      doctor,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Update Doctor average rating and total reviews
    const allDocReviews = await Review.find({ doctor });
    const totalReviews = allDocReviews.length;
    const avgRating =
      Math.round(
        (allDocReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10
      ) / 10;

    await Doctor.findByIdAndUpdate(doctor, {
      rating: avgRating,
      totalReviews,
    });

    await Activity.create({
      title: "New doctor review received",
      type: "review",
    });

    await logAuditEvent({
      req,
      action: "REVIEW_CREATED",
      resource: "Review",
      resourceId: review._id,
      details: { doctorId: doctor, rating },
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit review.",
      code: "REVIEW_CREATE_ERROR",
    });
  }
};

// Get Reviews of a Doctor (Public)
export const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      doctor: req.params.id,
    })
      .populate("patient", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "REVIEWS_FETCH_ERROR",
    });
  }
};

// Get All Reviews (Public / Admin)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("patient", "name email")
      .populate("doctor", "name specialization hospital")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "ALL_REVIEWS_FETCH_ERROR",
    });
  }
};

// Delete Review (Ownership or Admin Checked)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        code: "REVIEW_NOT_FOUND",
      });
    }

    const userId = String(req.user._id);
    const isOwner = String(review.patient) === userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review.",
        code: "UNAUTHORIZED_REVIEW_DELETE",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Recalculate doctor rating
    const allDocReviews = await Review.find({ doctor: review.doctor });
    const totalReviews = allDocReviews.length;
    const avgRating =
      totalReviews > 0
        ? Math.round((allDocReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
        : 0;

    await Doctor.findByIdAndUpdate(review.doctor, {
      rating: avgRating,
      totalReviews,
    });

    await logAuditEvent({
      req,
      action: "REVIEW_DELETED",
      resource: "Review",
      resourceId: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "REVIEW_DELETE_ERROR",
    });
  }
};
