import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute(
  "/dashboard/admin/reviews"
)({
  component: ReviewsManagement,
});

function ReviewsManagement() {
  const [reviews, setReviews] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/reviews"
      );

      setReviews(
        res.data.reviews || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this review?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/reviews/${id}`
      );

      alert("Review Deleted");

      fetchReviews();

    } catch (error) {
      console.log(error);
    }
  };

  const filteredReviews =
    reviews.filter((review) =>
      review.comment
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "0";

  return (
    <div className="rounded-2xl border bg-card p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Reviews Management
        </h1>

        <p className="text-muted-foreground">
          Manage patient reviews
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <div className="p-5 rounded-2xl border bg-card">
          <h3>Total Reviews</h3>

          <p className="text-3xl font-bold mt-2">
            {reviews.length}
          </p>
        </div>

        <div className="p-5 rounded-2xl border bg-card">
          <h3>Average Rating</h3>

          <p className="text-3xl font-bold mt-2">
            ⭐ {averageRating}
          </p>
        </div>

      </div>

      <input
        type="text"
        placeholder="Search Reviews..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full border rounded-xl p-3 mb-5"
      />

      {loading ? (
        <div className="text-center py-10">
          Loading Reviews...
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b">

                <th className="p-4 text-left">
                  Patient
                </th>

                <th className="p-4 text-left">
                  Doctor
                </th>

                <th className="p-4 text-left">
                  Rating
                </th>

                <th className="p-4 text-left">
                  Comment
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredReviews.map(
                (review) => (
                  <tr
                    key={review._id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4">
                      {review.patient?.name}
                    </td>

                    <td className="p-4">
                      {review.doctor?.name}
                    </td>

                    <td className="p-4">
                      ⭐ {review.rating}
                    </td>

                    <td className="p-4 max-w-md">
                      {review.comment}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() =>
                          handleDeleteReview(
                            review._id
                          )
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}