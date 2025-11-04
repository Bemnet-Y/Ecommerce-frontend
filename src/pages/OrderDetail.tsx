import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getOrder, type Order, cancelOrder } from "../services/orderService";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const orderData = await getOrder(id!);
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("Order not found.");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      return;
    }

    setCancelling(true);
    try {
      const updatedOrder = await cancelOrder(id!);
      setOrder(updatedOrder);
      alert("Order cancelled successfully!");
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      alert(
        error.response?.data?.message ||
          "Error cancelling order. Please try again."
      );
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Confirmation";
      case "confirmed":
        return "Order Confirmed";
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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Your order is being processed. We will confirm it shortly.";
      case "confirmed":
        return "Your order has been confirmed and is being prepared for shipment.";
      case "processing":
        return "Your order is being processed and will be shipped soon.";
      case "shipped":
        return "Your order has been shipped and is on its way to you.";
      case "delivered":
        return "Your order has been delivered. We hope you love your products!";
      case "cancelled":
        return "This order has been cancelled.";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-secondary-600 mt-4">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
              Order Not Found
            </h2>
            <button onClick={() => navigate("/orders")} className="btn-primary">
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canCancel = ["pending", "confirmed"].includes(order.orderStatus);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-6">
          <Link to="/dashboard" className="hover:text-primary-600">
            Dashboard
          </Link>
          <span>›</span>
          <Link to="/orders" className="hover:text-primary-600">
            My Orders
          </Link>
          <span>›</span>
          <span className="text-secondary-800">Order #{order.orderNumber}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="card p-6">
              <div
                className={`border-l-4 ${getStatusColor(
                  order.orderStatus
                )} pl-4 py-2`}
              >
                <h2 className="text-xl font-elegant font-semibold text-secondary-800">
                  {getStatusText(order.orderStatus)}
                </h2>
                <p className="text-secondary-600 mt-1">
                  {getStatusDescription(order.orderStatus)}
                </p>
                {order.trackingNumber && (
                  <div className="mt-3">
                    <p className="text-sm text-secondary-600">
                      Tracking Number:{" "}
                      <span className="font-semibold">
                        {order.trackingNumber}
                      </span>
                    </p>
                    <button className="btn-secondary text-sm mt-2">
                      Track Package
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="card p-6">
              <h2 className="text-xl font-elegant font-semibold text-secondary-800 mb-6">
                Order Items ({order.items.length})
              </h2>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-lg"
                  >
                    <div className="w-20 h-20 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-primary-600 text-xl">
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
                      <div className="font-semibold text-primary-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="text-xl font-elegant font-semibold text-secondary-800 mb-4">
                Shipping Information
              </h2>
              <div className="bg-secondary-50 rounded-lg p-4">
                <p className="font-semibold text-secondary-800">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p className="text-secondary-600">
                  {order.shippingAddress.email}
                </p>
                <p className="text-secondary-600">
                  {order.shippingAddress.phone}
                </p>
                <p className="text-secondary-600 mt-2">
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-xl font-elegant font-semibold text-secondary-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-secondary-600">
                  <span>Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary-600">
                  <span>Shipping</span>
                  <span>
                    {order.shippingCost === 0
                      ? "FREE"
                      : `$${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-secondary-600">
                  <span>Tax</span>
                  <span>${order.taxAmount.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-secondary-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-secondary-800">
                    <span>Total</span>
                    <span>${order.finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-secondary-600">
                  <p>
                    <strong>Order Number:</strong> {order.orderNumber}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {order.paymentMethod}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-secondary-200 space-y-3">
                {canCancel && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="btn-secondary w-full text-center disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
                <Link
                  to="/orders"
                  className="btn-secondary w-full text-center block"
                >
                  Back to Orders
                </Link>
                <Link
                  to="/products"
                  className="btn-primary w-full text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
