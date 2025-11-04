import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserReviews,
  type Review,
  deleteReview,
} from "../services/reviewService";
import { Link } from "react-router-dom";

const MyReviews: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const response = await getUserReviews();
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(reviewId);
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      alert("Review deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting review:", error);
      alert(
        error.response?.data?.message ||
          "Error deleting review. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < rating ? "text-yellow-500" : "text-gray-300"}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-secondary-600 mt-4">Loading your reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-elegant font-bold text-secondary-800">
                My Reviews
              </h1>
              <p className="text-secondary-600 mt-2">
                Manage and view all your product reviews
              </p>
            </div>
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Product Image */}
                    <Link
                      to={`/product/${review.product._id}`}
                      className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                      {review.product.images &&
                      review.product.images.length > 0 ? (
                        <img
                          src={review.product.images[0]}
                          alt={review.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-primary-600">
                          {review.product.category?.image || "🛍️"}
                        </span>
                      )}
                    </Link>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${review.product._id}`}
                        className="font-semibold text-secondary-800 hover:text-primary-600 transition-colors text-lg block mb-2"
                      >
                        {review.product.name}
                      </Link>
                      <p className="text-secondary-600 text-sm mb-2">
                        {review.product.brand}
                      </p>

                      <div className="flex items-center space-x-4 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-sm text-secondary-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        {review.isVerified && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>

                      {review.title && (
                        <h4 className="font-semibold text-secondary-800 mb-2">
                          {review.title}
                        </h4>
                      )}

                      <p className="text-secondary-700 leading-relaxed">
                        {review.comment}
                      </p>

                      {/* Review Stats */}
                      <div className="flex items-center space-x-4 mt-3 text-sm text-secondary-600">
                        <span>Helpful: {review.helpful}</span>
                        <span>Not Helpful: {review.notHelpful}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      disabled={deletingId === review._id}
                      className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {deletingId === review._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Order Info */}
                <div className="pt-4 border-t border-secondary-200">
                  <p className="text-sm text-secondary-600">
                    Order:{" "}
                    <span className="font-semibold">
                      {review.order.orderNumber}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-600 text-3xl">💬</span>
            </div>
            <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
              No Reviews Yet
            </h2>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              You haven't written any reviews yet. After purchasing products,
              you can share your experience to help other customers.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/orders" className="btn-primary">
                View My Orders
              </Link>
              <Link to="/products" className="btn-secondary">
                Browse Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
