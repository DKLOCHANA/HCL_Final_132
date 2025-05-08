import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../utils/authContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    // Show loading spinner while checking authentication
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;