import api from "./api";
import type { Category } from "./categoryService";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: Category;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  brand: string;
  sku: string;
  stock: number;
  isActive: boolean;
  features: string[];
  ingredients?: string;
  howToUse?: string;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  seller?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getProducts = async (
  filters: ProductFilters = {}
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/products?${params}`);
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

export const createProduct = async (productData: any): Promise<Product> => {
  const response = await api.post("/products", productData);
  return response.data.data;
};

export const updateProduct = async (
  id: string,
  productData: any
): Promise<Product> => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const getSellerProducts = async (
  filters: { page?: number; limit?: number } = {}
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/products/seller?${params}`);
  return response.data;
};
