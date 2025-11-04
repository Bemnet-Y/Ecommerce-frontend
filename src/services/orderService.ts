import api from "./api";
import type { Product } from "./productService";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "card" | "paypal" | "stripe";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  cartItems: any[];
  cartTotal: number;
  shippingCost: number;
  taxAmount: number;
  finalAmount: number;
  notes?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const createOrder = async (
  orderData: CreateOrderData
): Promise<Order> => {
  const response = await api.post("/orders", orderData);
  return response.data.data;
};

export const getOrders = async (
  filters: { page?: number; limit?: number; status?: string } = {}
): Promise<OrdersResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/orders?${params}`);
  return response.data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return response.data.data;
};

export const getSellerOrders = async (
  filters: { page?: number; limit?: number; status?: string } = {}
): Promise<OrdersResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/orders/seller?${params}`);
  return response.data;
};

export const updateOrderStatus = async (
  id: string,
  statusData: { orderStatus: string; trackingNumber?: string }
): Promise<Order> => {
  const response = await api.put(`/orders/${id}/status`, statusData);
  return response.data.data;
};

export const cancelOrder = async (id: string): Promise<Order> => {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data.data;
};
export const getDeliveredOrders = async (): Promise<OrdersResponse> => {
  const response = await api.get("/orders?status=delivered");
  return response.data;
};
