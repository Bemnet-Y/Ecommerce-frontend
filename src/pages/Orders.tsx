import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getOrders, type Order } from "../services/orderService";
import { Link } from "react-router-dom";

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await getOrders({
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-secondary-600 mt-4">Loading your orders...</p>
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
                My Orders
              </h1>
              <p className="text-secondary-600 mt-2">
                Track and manage your beauty product orders
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
              <Link to="/products" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
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
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>
                    <p className="text-secondary-600 text-sm mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}{" "}
                      at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-secondary-800">
                      ${order.finalAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-secondary-600">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item, index) => (
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
                        <Link
                          to={`/product/${item.product._id}`}
                          className="font-semibold text-secondary-800 hover:text-primary-600 transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-secondary-600 text-sm">
                          {item.product.brand}
                        </p>
                        <p className="text-secondary-500 text-sm">
                          Sold by {item.seller.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-secondary-800">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-secondary-600">
                          Qty: {item.quantity}
                        </div>
                        <div className="text-sm font-semibold text-primary-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-200">
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
                    {order.orderStatus === "pending" && (
                      <button className="btn-primary text-sm">
                        Track Order
                      </button>
                    )}
                    {order.orderStatus === "delivered" && (
                      <button className="btn-primary text-sm">
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
                ? `No ${statusFilter} orders found.`
                : "You haven't placed any orders yet. Start shopping to discover amazing beauty products!"}
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/products" className="btn-primary">
                Start Shopping
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

export default Orders;
