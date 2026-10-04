import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchAllReviews, deleteReviewApi } from "@/services/api";

export const Route = createFileRoute(
  "/dashboard/admin/reviews"
)({
  component: ReviewsManagement,
});

function ReviewsManagement() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadReviews = async () => {
    try {
      const res = await fetchAllReviews();
      setReviews(res.reviews || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      await deleteReviewApi(id);
      alert("Review Deleted");
      loadReviews();
    } catch (error) {
      console.log(error);
      alert("Failed to delete review.");
    }
  };

  const filteredReviews = reviews.filter((review) =>
    review.comment?.toLowerCase().includes(search.toLowerCase()) ||
    review.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
    review.patient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        ).toFixed(1)
      : "0";

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reviews Management</h1>
        <p className="text-muted-foreground">Manage and moderate verified patient reviews</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-5 rounded-2xl border bg-card shadow-sm">
          <h3 className="text-muted-foreground text-sm font-semibold">Total Patient Reviews</h3>
          <p className="text-3xl font-bold mt-2">{reviews.length}</p>
        </div>

        <div className="p-5 rounded-2xl border bg-card shadow-sm">
          <h3 className="text-muted-foreground text-sm font-semibold">Platform Average Rating</h3>
          <p className="text-3xl font-bold mt-2 text-amber-500">⭐ {averageRating} / 5.0</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search reviews by doctor, patient, or comment..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-xl p-3 mb-5 bg-background"
      />

      {loading ? (
        <div className="text-center py-10">Loading Reviews...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs uppercase text-muted-foreground">
                <th className="p-4 text-left">Patient</th>
                <th className="p-4 text-left">Doctor</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Comment</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review._id} className="border-b hover:bg-slate-50/50">
                  <td className="p-4 font-medium">{review.patient?.name || "Patient"}</td>
                  <td className="p-4 text-teal font-semibold">{review.doctor?.name || "Doctor"}</td>
                  <td className="p-4 font-semibold text-amber-500">⭐ {review.rating}</td>
                  <td className="p-4 max-w-md text-sm text-muted-foreground">{review.comment}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No reviews found.</div>
          )}
        </div>
      )}
    </div>
  );
}