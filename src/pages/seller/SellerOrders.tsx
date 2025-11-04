import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getSellerOrders,
  type Order,
  updateOrderStatus,
} from "../../services/orderService";
import { Link } from "react-router-dom";

const SellerOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchSellerOrders();
  }, [statusFilter]);

  const fetchSellerOrders = async () => {
    try {
      const response = await getSellerOrders({
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: string,
    trackingNumber?: string
  ) => {
    setUpdatingOrder(orderId);
    try {
      const updatedOrder = await updateOrderStatus(orderId, {
        orderStatus: newStatus,
        trackingNumber,
      });
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? updatedOrder : order))
      );
      alert("Order status updated successfully!");
    } catch (error: any) {
      console.error("Error updating order status:", error);
      alert(
        error.response?.data?.message ||
          "Error updating order status. Please try again."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow = {
      pending: "confirmed",
      confirmed: "processing",
      processing: "shipped",
      shipped: "delivered",
    };
    return statusFlow[currentStatus as keyof typeof statusFlow] || null;
  };

  const getStatusActionText = (currentStatus: string): string => {
    switch (currentStatus) {
      case "pending":
        return "Confirm Order";
      case "confirmed":
        return "Start Processing";
      case "processing":
        return "Mark as Shipped";
      case "shipped":
        return "Mark as Delivered";
      default:
        return "Update Status";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-secondary-600 mt-4">Loading orders...</p>
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
                Seller Orders
              </h1>
              <p className="text-secondary-600 mt-2">
                Manage and track orders for your products
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Link to="/seller/products" className="btn-secondary">
                Manage Products
              </Link>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              // Filter items to show only those belonging to this seller
              const sellerItems = order.items.filter(
                (item) => item.seller._id === user?._id
              );

              if (sellerItems.length === 0) return null;

              const orderTotal = sellerItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              );

              const nextStatus = getNextStatus(order.orderStatus);
              const canUpdateStatus =
                nextStatus &&
                !["cancelled", "delivered"].includes(order.orderStatus);

              return (
                <div key={order._id} className="card p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-secondary-200">
                    <div>
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-secondary-800">
                          Order #{order.orderNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-secondary-600 text-sm mt-1">
                        Customer: {order.customer.name} •{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-secondary-800">
                        ${orderTotal.toFixed(2)}
                      </div>
                      <div className="text-sm text-secondary-600">
                        {sellerItems.length}{" "}
                        {sellerItems.length === 1 ? "item" : "items"}
                      </div>
                    </div>
                  </div>

                  {/* Seller Items */}
                  <div className="space-y-4 mb-4">
                    {sellerItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.product.images &&
                          item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-primary-600">
                              {item.product.category?.image || "🛍️"}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-secondary-800 line-clamp-2">
                            {item.product.name}
                          </div>
                          <p className="text-secondary-600 text-sm">
                            {item.product.brand}
                          </p>
                          <p className="text-secondary-500 text-sm">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                    <div className="text-sm text-secondary-600">
                      <p>
                        Shipping to: {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </p>
                      {order.trackingNumber && (
                        <p className="mt-1">
                          Tracking:{" "}
                          <span className="font-semibold">
                            {order.trackingNumber}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/orders/${order._id}`}
                        className="btn-secondary text-sm"
                      >
                        View Details
                      </Link>
                      {canUpdateStatus && (
                        <button
                          onClick={() => {
                            if (nextStatus === "shipped") {
                              const trackingNumber = prompt(
                                "Enter tracking number:"
                              );
                              if (trackingNumber) {
                                handleStatusUpdate(
                                  order._id,
                                  nextStatus,
                                  trackingNumber
                                );
                              }
                            } else {
                              handleStatusUpdate(order._id, nextStatus);
                            }
                          }}
                          disabled={updatingOrder === order._id}
                          className="btn-primary text-sm disabled:opacity-50"
                        >
                          {updatingOrder === order._id
                            ? "Updating..."
                            : getStatusActionText(order.orderStatus)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-600 text-3xl">📦</span>
            </div>
            <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
              No Orders Yet
            </h2>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              {statusFilter !== "all"
                ? `No ${statusFilter} orders found for your products.`
                : "You haven't received any orders for your products yet. Promote your products to get more visibility!"}
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/seller/products" className="btn-primary">
                Manage Products
              </Link>
              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="btn-secondary"
                >
                  View All Orders
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
