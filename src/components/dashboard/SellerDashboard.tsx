import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Total Products", value: "0", color: "bg-blue-500" },
    { label: "Orders This Month", value: "0", color: "bg-green-500" },
    { label: "Total Revenue", value: "$0", color: "bg-purple-500" },
    { label: "Customer Reviews", value: "0", color: "bg-yellow-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-elegant font-bold text-secondary-800">
              Seller Dashboard 🛍️
            </h1>
            <p className="text-secondary-600 mt-2">
              Welcome to your seller dashboard! Start by adding your first
              product.
            </p>
          </div>
          <Link to="/seller/create-product" className="btn-primary">
            Add New Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-secondary-800">
                  {stat.value}
                </h3>
                <p className="text-secondary-600">{stat.label}</p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}
              >
                <span className="text-white text-lg">📈</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/seller/create-product"
            className="card p-4 text-center hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
              <span className="text-blue-600 text-xl">➕</span>
            </div>
            <span className="font-semibold text-secondary-800">
              Add Product
            </span>
          </Link>
          <Link
            to="/seller/products"
            className="card p-4 text-center hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
            <span className="font-semibold text-secondary-800">
              My Products
            </span>
          </Link>

          <button className="card p-4 text-center hover:shadow-lg transition-shadow opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">📊</span>
            </div>
            <span className="font-semibold text-secondary-600">
              View Analytics
            </span>
          </button>

          <button className="card p-4 text-center hover:shadow-lg transition-shadow opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-xl">📦</span>
            </div>
            <span className="font-semibold text-secondary-600">
              Manage Orders
            </span>
          </button>

          <button className="card p-4 text-center hover:shadow-lg transition-shadow opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-yellow-600 text-xl">⭐</span>
            </div>
            <span className="font-semibold text-secondary-600">
              Customer Reviews
            </span>
          </button>
        </div>
      </div>

      {/* Empty Products Section */}
      <div className="card p-8 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-green-600 text-3xl">📦</span>
        </div>
        <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
          No Products Yet
        </h2>
        <p className="text-secondary-600 mb-6 max-w-md mx-auto">
          You haven't added any products yet. Start your selling journey by
          adding your first beauty product to the platform.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/seller/create-product" className="btn-primary">
            Add Your First Product
          </Link>
          <button className="btn-secondary" disabled>
            Learn About Selling
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
