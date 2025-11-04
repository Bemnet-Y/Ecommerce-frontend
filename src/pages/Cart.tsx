import React from "react";
import { useCart } from "../contexts/cartContext.tsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Cart: React.FC = () => {
  const {
    cartItems,

    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (!user) {
      alert("Please login to proceed to checkout");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // TODO: Implement checkout process
    alert("Proceeding to checkout! This will be implemented next.");
  };

  const shippingCost = getCartTotal() > 50 ? 0 : 9.99;
  const tax = getCartTotal() * 0.08; // 8% tax
  const finalTotal = getCartTotal() + shippingCost + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-600 text-3xl">🛒</span>
            </div>
            <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              Looks like you haven't added any beauty products to your cart yet.
              Start shopping to discover amazing products!
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/products" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
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
                Shopping Cart
              </h1>
              <p className="text-secondary-600 mt-2">
                Review your beauty products and proceed to checkout
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-secondary-600">
                {getCartItemsCount()}{" "}
                {getCartItemsCount() === 1 ? "item" : "items"}
              </span>
              <button onClick={clearCart} className="btn-secondary text-sm">
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-elegant font-semibold text-secondary-800 mb-6">
                Cart Items ({getCartItemsCount()})
              </h2>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.images.length > 0 ? (
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

                    {/* Product Info */}
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
                        By {item.product.seller.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-semibold text-primary-600">
                          ${item.product.price}
                        </span>
                        {item.product.originalPrice &&
                          item.product.originalPrice > item.product.price && (
                            <span className="text-sm text-secondary-500 line-through">
                              ${item.product.originalPrice}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity - 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center border border-secondary-300 rounded-lg hover:bg-secondary-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center border border-secondary-300 rounded-lg hover:bg-secondary-100 transition-colors"
                        disabled={item.quantity >= item.product.stock}
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-20">
                      <div className="font-semibold text-secondary-800">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-secondary-500">
                        ${item.product.price} each
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from cart"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-xl font-elegant font-semibold text-secondary-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-secondary-600">
                  <span>Subtotal ({getCartItemsCount()} items)</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-secondary-600">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "FREE"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-secondary-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {shippingCost === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm text-center">
                      🎉 Free shipping on orders over $50!
                    </p>
                  </div>
                )}

                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-secondary-800">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full text-lg py-4 mb-4 text-center block"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="btn-secondary w-full text-center block"
              >
                Continue Shopping
              </Link>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="flex justify-center space-x-6 text-secondary-500">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🔒</div>
                    <div className="text-xs">Secure Checkout</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🚚</div>
                    <div className="text-xs">Free Shipping*</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">↩️</div>
                    <div className="text-xs">Easy Returns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed / Recommendations (Placeholder) */}
        <div className="card p-6 mt-8">
          <h2 className="text-xl font-elegant font-semibold text-secondary-800 mb-6">
            You Might Also Like
          </h2>
          <div className="text-center text-secondary-500 py-8">
            <p>Product recommendations will appear here</p>
            <p className="text-sm mt-2">
              Based on your cart items and browsing history
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
