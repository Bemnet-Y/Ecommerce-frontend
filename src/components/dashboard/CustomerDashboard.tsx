import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Orders", value: "0", color: "bg-blue-500" },
    { label: "Wishlist", value: "0", color: "bg-pink-500" },
    { label: "Reviews", value: "0", color: "bg-green-500" },
    { label: "Loyalty Points", value: "0", color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-elegant font-bold text-secondary-800">
              Welcome to BloomBeauty! ✨
            </h1>
            <p className="text-secondary-600 mt-2">
              Start your beauty journey with us. Explore our products and find
              your perfect match.
            </p>
          </div>
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <p className="text-primary-700 font-semibold">
              New Customer Bonus!
            </p>
            <p className="text-primary-600 text-sm">
              Get 10% off your first order
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6 text-center">
            <div
              className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}
            >
              <span className="text-white text-lg">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800">
              {stat.value}
            </h3>
            <p className="text-secondary-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Empty State for Products */}
      <div className="card p-8 text-center">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-primary-600 text-3xl">🛍️</span>
        </div>
        <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
          No Products Yet
        </h2>
        <p className="text-secondary-600 mb-6 max-w-md mx-auto">
          Sellers haven't added any products to the platform yet. Check back
          soon to discover amazing beauty products!
        </p>
        <button className="btn-primary" disabled>
          Browse Products (Coming Soon)
        </button>
      </div>

      {/* Empty Recent Activity */}
      <div className="card p-6">
        <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-6">
          Recent Activity
        </h2>
        <div className="text-center text-secondary-500 py-8">
          <p>No recent activity yet</p>
          <p className="text-sm mt-2">
            Start shopping to see your activity here
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
