import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/cartContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show navbar on landing page or auth pages when not logged in
  if (
    (location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/register") &&
    !user
  ) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cartItemsCount = getCartItemsCount();

  return (
    <nav className="bg-white shadow-sm border-b border-primary-100">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link
              to={user ? "/dashboard" : "/"}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-elegant font-bold text-primary-700">
                  BloomBeauty
                </h1>
                <p className="text-xs text-secondary-500 -mt-1">
                  Cosmetics & Skincare
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Menu - Only show when user is logged in */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/products"
                className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
              >
                Categories
              </Link>
              <Link
                to={user?.role === "customer" ? "/orders" : "/seller/orders"}
                className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
              >
                {user?.role === "customer" ? "My Orders" : "Orders"}
              </Link>

              {/* Seller-specific links */}
              {user.role === "seller" && (
                <Link
                  to="/seller/products"
                  className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                >
                  My Products
                </Link>
              )}
            </div>
          )}
          {user?.role === "customer" && (
            <Link
              to="/my-reviews"
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
            >
              💬 My Reviews
            </Link>
          )}
          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Icons */}
                <button className="p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                  🔍
                </button>
                <button className="p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                  ♡
                </button>

                {/* Cart Icon with Badge */}
                <Link
                  to="/cart"
                  className="p-2 text-secondary-600 hover:text-primary-600 transition-colors relative"
                >
                  🛒
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount > 9 ? "9+" : cartItemsCount}
                    </span>
                  )}
                </Link>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-primary-50 px-3 py-2 rounded-full">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-secondary-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-primary-600 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-secondary-100 hover:bg-secondary-200 text-secondary-800 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // This should not show when user is logged in, but just in case
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
