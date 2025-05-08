import React from "react";
import { Link } from "react-router-dom";
import { FaLock, FaHome } from "react-icons/fa";

const UnauthorizedPage = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="text-center p-5">
        <FaLock size={60} className="text-danger mb-4" />
        <h2 className="mb-4">Access Denied</h2>
        <p className="lead mb-4">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <div className="mt-4">
          <Link to="/" className="btn btn-primary me-3">
            <FaHome className="me-2" /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;