import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getProductReviews,
  type Review,
  type ReviewsResponse,
} from "../../services/reviewService";
import WriteReview from "./WriteReview";

interface ProductReviewsProps {
  productId: string;
  productName?: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productName = "this product",
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [ratingDistribution, setRatingDistribution] = useState<
    { _id: number; count: number }[]
  >([]);
  const [stats, setStats] = useState({ total: 0, average: 0 });
  const [showWriteReview, setShowWriteReview] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, ratingFilter, sortBy]);

  const fetchReviews = async () => {
    try {
      const response: ReviewsResponse = await getProductReviews(productId, {
        rating: ratingFilter === "all" ? undefined : ratingFilter,
        sort: sortBy,
        limit: 10,
      });
      setReviews(response.data);
      setRatingDistribution(response.ratingDistribution || []);
      setStats({
        total: response.pagination.total,
        average: calculateAverageRating(response.ratingDistribution || []),
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (
    distribution: { _id: number; count: number }[]
  ): number => {
    if (distribution.length === 0) return 0;

    const total = distribution.reduce(
      (sum, item) => sum + item._id * item.count,
      0
    );
    const count = distribution.reduce((sum, item) => sum + item.count, 0);

    return Math.round((total / count) * 10) / 10;
  };

  const getRatingPercentage = (rating: number): number => {
    const total = ratingDistribution.reduce((sum, item) => sum + item.count, 0);
    if (total === 0) return 0;

    const ratingCount =
      ratingDistribution.find((item) => item._id === rating)?.count || 0;
    return Math.round((ratingCount / total) * 100);
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    return (
      <div className={`flex ${sizeClasses[size]}`}>
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

  const handleReviewSubmitted = () => {
    setShowWriteReview(false);
    fetchReviews(); // Refresh reviews
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card p-6">
        <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-6">
          Customer Reviews
        </h2>

        {/* Reviews Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-800 mb-2">
              {stats.average.toFixed(1)}
            </div>
            {renderStars(Math.round(stats.average), "lg")}
            <div className="text-secondary-600 text-sm mt-2">
              {stats.total} {stats.total === 1 ? "review" : "reviews"}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-secondary-800 mb-3">
              Rating Breakdown
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const percentage = getRatingPercentage(rating);
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setRatingFilter(
                          ratingFilter === rating.toString()
                            ? "all"
                            : rating.toString()
                        )
                      }
                      className={`flex items-center space-x-1 text-sm ${
                        ratingFilter === rating.toString()
                          ? "text-primary-600 font-semibold"
                          : "text-secondary-600"
                      }`}
                    >
                      <span>{rating}</span>
                      <span>⭐</span>
                    </button>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-secondary-600 w-10">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-secondary-700">
              Filter by:
            </span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-secondary-700">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-secondary-200 pb-6 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      {renderStars(review.rating)}
                      {review.title && (
                        <h4 className="font-semibold text-secondary-800">
                          {review.title}
                        </h4>
                      )}
                    </div>
                    <p className="text-secondary-600 text-sm">
                      by{" "}
                      <span className="font-medium">
                        {review.customer.name}
                      </span>
                      {review.isVerified && (
                        <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-secondary-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-secondary-700 mb-4 leading-relaxed">
                  {review.comment}
                </p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex space-x-2 mb-4">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-secondary-200 cursor-pointer hover:opacity-80"
                        onClick={() => window.open(image, "_blank")}
                      />
                    ))}
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="flex items-center space-x-4 text-sm text-secondary-600">
                  <span>Was this review helpful?</span>
                  <button className="flex items-center space-x-1 hover:text-primary-600 transition-colors">
                    <span>👍</span>
                    <span>{review.helpful}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-primary-600 transition-colors">
                    <span>👎</span>
                    <span>{review.notHelpful}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-secondary-600">
              Be the first to review this product!
            </p>
          </div>
        )}

        {/* Write Review Button */}
        {user?.role === "customer" && (
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <button
              onClick={() => setShowWriteReview(true)}
              className="btn-primary"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {showWriteReview && (
        // In the WriteReview component usage, remove the orderId prop:
        <WriteReview
          productId={productId}
          productName={productName}
          onReviewSubmitted={handleReviewSubmitted}
          onCancel={() => setShowWriteReview(false)}
        />
      )}
    </>
  );
};

export default ProductReviews;
