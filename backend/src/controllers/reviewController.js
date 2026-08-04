import Review from "../models/Review.js";
import Activity from "../models/Activity.js";

// Add Review
export const addReview = async (req, res) => {
  try {
    const review = await Review.create({
      patient: req.user._id,
      doctor: req.body.doctor,
      rating: req.body.rating,
      comment: req.body.comment
    });
await Activity.create({
  title: "New review received",
  type: "review",
});
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Reviews of a Doctor
export const getDoctorReviews = async (
  req,
  res
) => {
  try {
    const reviews = await Review.find({
      doctor: req.params.id
    }).populate("patient", "name email");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Reviews
export const getAllReviews = async (
  req,
  res
) => {
  try {
    const reviews = await Review.find()
      .populate("patient", "name")
      .populate("doctor", "name");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Review
export const deleteReview = async (
  req,
  res
) => {
  try {
    const review =
      await Review.findByIdAndDelete(
        req.params.id
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



