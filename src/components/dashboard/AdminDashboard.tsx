import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Total Users", value: "0", color: "bg-blue-500", icon: "👥" },
    { label: "Total Products", value: "0", color: "bg-green-500", icon: "🛍️" },
    { label: "Total Orders", value: "0", color: "bg-purple-500", icon: "📦" },
    { label: "Total Revenue", value: "$0", color: "bg-yellow-500", icon: "💰" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user_registered",
      message: "New user registered",
      time: "Just now",
      user: "John Doe",
    },
    {
      id: 2,
      type: "product_added",
      message: "New product added",
      time: "5 minutes ago",
      user: "Beauty Seller",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-elegant font-bold text-secondary-800">
              Admin Dashboard ⚡
            </h1>
            <p className="text-secondary-600 mt-2">
              Manage the entire BloomBeauty platform and monitor system
              performance
            </p>
          </div>
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <p className="text-primary-700 font-semibold">
              Platform Status: Active
            </p>
            <p className="text-primary-600 text-sm">All systems operational</p>
          </div>
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
                <span className="text-white text-lg">{stat.icon}</span>
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
          <button className="card p-4 text-center hover:shadow-lg transition-shadow group">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <span className="font-semibold text-secondary-800">
              Manage Users
            </span>
            <p className="text-xs text-secondary-500 mt-1">
              View and manage all users
            </p>
          </button>
          <button className="card p-4 text-center hover:shadow-lg transition-shadow group">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
              <span className="text-green-600 text-xl">🛍️</span>
            </div>
            <span className="font-semibold text-secondary-800">
              Manage Products
            </span>
            <p className="text-xs text-secondary-500 mt-1">
              View all platform products
            </p>
          </button>
          <button className="card p-4 text-center hover:shadow-lg transition-shadow group">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <span className="font-semibold text-secondary-800">
              View Analytics
            </span>
            <p className="text-xs text-secondary-500 mt-1">
              Platform performance data
            </p>
          </button>
          <button className="card p-4 text-center hover:shadow-lg transition-shadow group">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-200 transition-colors">
              <span className="text-yellow-600 text-xl">⚙️</span>
            </div>
            <span className="font-semibold text-secondary-800">
              System Settings
            </span>
            <p className="text-xs text-secondary-500 mt-1">
              Platform configuration
            </p>
          </button>
        </div>
      </div>

      {/* Recent Activity & System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 bg-secondary-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600">📝</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-secondary-800">
                    {activity.message}
                  </p>
                  <p className="text-sm text-secondary-600">
                    by {activity.user}
                  </p>
                </div>
                <span className="text-xs text-secondary-500">
                  {activity.time}
                </span>
              </div>
            ))}
            <div className="text-center text-secondary-500 py-4">
              <p>No more recent activities</p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="card p-6">
          <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-6">
            System Information
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-semibold text-secondary-800">Database</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-semibold text-secondary-800">
                API Server
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                Running
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold text-secondary-800">
                Platform Version
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                v1.0.0
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-semibold text-secondary-800">
                Users Online
              </span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-semibold">
                1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="card p-6">
        <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-6">
          Platform Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-3xl mb-2">👨‍💼</div>
            <h3 className="font-semibold text-secondary-800">
              User Management
            </h3>
            <p className="text-secondary-600 text-sm mt-2">
              Manage customer, seller, and admin accounts with role-based
              permissions
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">🛍️</div>
            <h3 className="font-semibold text-secondary-800">
              Product Moderation
            </h3>
            <p className="text-secondary-600 text-sm mt-2">
              Review and approve products added by sellers to maintain quality
              standards
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="font-semibold text-secondary-800">
              Analytics & Reports
            </h3>
            <p className="text-secondary-600 text-sm mt-2">
              Monitor platform performance, sales trends, and user engagement
              metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
