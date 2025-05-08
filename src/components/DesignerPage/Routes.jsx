import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomerDashboard from "./CustomerDashboard";

// Rest of the code remains unchanged

const CustomerRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="customer-dashboard" />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      </Routes>
    </div>
  );
};

export default CustomerRoutes;
