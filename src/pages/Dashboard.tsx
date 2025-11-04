import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/common/Navbar";
import CustomerDashboard from "../components/dashboard/CustomerDashboard";
import SellerDashboard from "../components/dashboard/SellerDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case "customer":
        return <CustomerDashboard />;
      case "seller":
        return <SellerDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 py-8">{renderDashboard()}</div>
    </div>
  );
};

export default Dashboard;
