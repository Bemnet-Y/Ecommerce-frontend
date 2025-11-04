import api from "./api";
import type { Product } from "./productService";

export interface Review {
  _id: string;
  product: Product;
  customer: {
    _id: string;
    name: string;
  };
  order: {
    _id: string;
    orderNumber: string;
  };
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  isVerified: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  ratingDistribution?: {
    _id: number;
    count: number;
  }[];
}

export interface CreateReviewData {
  productId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
}

export const createReview = async (
  reviewData: CreateReviewData
): Promise<Review> => {
  const response = await api.post("/reviews", reviewData);
  return response.data.data;
};

export const getProductReviews = async (
  productId: string,
  filters: {
    page?: number;
    limit?: number;
    rating?: string;
    sort?: string;
  } = {}
): Promise<ReviewsResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/reviews/product/${productId}?${params}`);
  return response.data;
};

export const getUserReviews = async (
  filters: { page?: number; limit?: number } = {}
): Promise<ReviewsResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/reviews/user?${params}`);
  return response.data;
};

export const updateReviewHelpful = async (
  reviewId: string,
  action: "helpful" | "not-helpful"
): Promise<Review> => {
  const response = await api.put(`/reviews/${reviewId}/helpful`, { action });
  return response.data.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete(`/reviews/${reviewId}`);
};
