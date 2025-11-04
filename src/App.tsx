import React from "react";
import Categories from "./pages/Categories";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import CreateProduct from "./pages/seller/CreateProduct";
import SellerProducts from "./pages/seller/SellerProducts";
import EditProduct from "./pages/seller/EditProduct";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import SellerOrders from "./pages/seller/SellerOrders";
import MyReviews from "./pages/MyReviews";
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">B</span>
          </div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={!user ? <Landing /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />

          {/* Fallback route */}
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/"} />}
          />
          <Route
            path="/categories"
            element={user ? <Categories /> : <Navigate to="/login" />}
          />
          <Route
            path="/products"
            element={user ? <Products /> : <Navigate to="/login" />}
          />
          <Route
            path="/seller/create-product"
            element={
              user && (user.role === "seller" || user.role === "admin") ? (
                <CreateProduct />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/seller/products"
            element={
              user && (user.role === "seller" || user.role === "admin") ? (
                <SellerProducts />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/seller/edit-product/:id"
            element={
              user && (user.role === "seller" || user.role === "admin") ? (
                <EditProduct />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/cart"
            element={user ? <Cart /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkout"
            element={user ? <Checkout /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders"
            element={user ? <Orders /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders/:id"
            element={user ? <OrderDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/seller/orders"
            element={
              user && (user.role === "seller" || user.role === "admin") ? (
                <SellerOrders />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/my-reviews"
            element={user ? <MyReviews /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
