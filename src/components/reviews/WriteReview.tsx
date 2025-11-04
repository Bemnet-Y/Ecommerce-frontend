import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  createReview,
  type CreateReviewData,
} from "../../services/reviewService";
import { getDeliveredOrders, type Order } from "../../services/orderService";

interface WriteReviewProps {
  productId: string;
  productName: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

const WriteReview: React.FC<WriteReviewProps> = ({
  productId,
  productName,
  onReviewSubmitted,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchDeliveredOrders = async () => {
    try {
      const response = await getDeliveredOrders();
      // Filter orders that contain the current product
      const ordersWithProduct = response.data.filter((order) =>
        order.items.some((item) => item.product._id === productId)
      );
      setOrders(ordersWithProduct);

      // Auto-select the first order if available
      if (ordersWithProduct.length > 0) {
        setSelectedOrderId(ordersWithProduct[0]._id);
      }
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
    } finally {
      setFetchingOrders(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrderId) {
      alert("Please select an order to verify your purchase");
      return;
    }

    if (formData.rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (formData.comment.trim().length < 10) {
      alert("Please write a review with at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      const reviewData: CreateReviewData = {
        productId,
        orderId: selectedOrderId,
        rating: formData.rating,
        title: formData.title.trim() || undefined,
        comment: formData.comment.trim(),
      };

      await createReview(reviewData);
      onReviewSubmitted();
    } catch (error: any) {
      console.error("Error creating review:", error);
      alert(
        error.response?.data?.message ||
          "Error submitting review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderStars = (forInput: boolean = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = forInput
            ? star <= (hoverRating || formData.rating)
            : star <= formData.rating;

          return (
            <button
              key={star}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`text-2xl transition-transform hover:scale-110 ${
                isFilled ? "text-yellow-500" : "text-gray-300"
              }`}
              disabled={!forInput}
            >
              ⭐
            </button>
          );
        })}
      </div>
    );
  };

  if (fetchingOrders) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full">
          <div className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 text-2xl">📦</span>
              </div>
              <h2 className="text-xl font-elegant font-bold text-secondary-800 mb-4">
                No Deliveries Found
              </h2>
              <p className="text-secondary-600 mb-6">
                You need to purchase and receive this product before you can
                review it.
              </p>
              <div className="flex space-x-3">
                <button onClick={onCancel} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={() => (window.location.href = "/orders")}
                  className="btn-primary flex-1"
                >
                  View Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-elegant font-bold text-secondary-800">
              Write a Review
            </h2>
            <button
              onClick={onCancel}
              className="text-secondary-500 hover:text-secondary-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Product Info */}
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-secondary-800">Reviewing:</h3>
            <p className="text-secondary-600">{productName}</p>
          </div>

          {/* Order Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Select Order to Verify Purchase *
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              required
            >
              <option value="">Choose an order...</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  Order #{order.orderNumber} -{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
            <p className="text-xs text-secondary-500 mt-1">
              Only delivered orders containing this product are shown
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Overall Rating *
              </label>
              <div className="flex items-center space-x-4">
                {renderStars(true)}
                <span className="text-lg font-semibold text-secondary-800">
                  {formData.rating > 0
                    ? `${formData.rating}.0`
                    : "Select rating"}
                </span>
              </div>
              <div className="flex justify-between text-xs text-secondary-500 mt-2">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Review Title (Optional)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Summarize your experience in a few words"
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                maxLength={100}
              />
              <div className="text-right text-xs text-secondary-500 mt-1">
                {formData.title.length}/100
              </div>
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Your Review *
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows={6}
                placeholder="Share your experience with this product. What did you like or dislike? How does it perform?"
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                required
                minLength={10}
                maxLength={1000}
              />
              <div className="flex justify-between text-xs text-secondary-500 mt-1">
                <span>Minimum 10 characters</span>
                <span>{formData.comment.length}/1000</span>
              </div>
            </div>

            {/* Review Guidelines */}
            <div className="bg-secondary-50 rounded-lg p-4">
              <h4 className="font-semibold text-secondary-800 text-sm mb-2">
                Review Guidelines:
              </h4>
              <ul className="text-xs text-secondary-600 space-y-1">
                <li>• Be specific about your experience with the product</li>
                <li>• Mention quality, effectiveness, and value for money</li>
                <li>• Avoid personal information or offensive language</li>
                <li>• Your review will be marked as "Verified Purchase"</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  !selectedOrderId ||
                  formData.rating === 0 ||
                  formData.comment.trim().length < 10
                }
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;
