import React, { useState, useContext } from "react";
import logo from "../../assets/logo.png";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { FaUserCog, FaUser } from "react-icons/fa";
import { AuthContext } from "../../utils/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, setUser, setRole } = useContext(AuthContext);
  const [showTestOptions, setShowTestOptions] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Quick login functions for testing
  const loginAsAdmin = (e) => {
    e.preventDefault();
    setUser(true);
    setRole("admin");
    localStorage.setItem("authToken", "dummy-admin-token");
    window.location.href = "/admin";
    setShowTestOptions(false);
  };

  const loginAsCustomer = (e) => {
    e.preventDefault();
    setUser(true);
    setRole("customer");
    localStorage.setItem("authToken", "dummy-customer-token");
    window.location.href = "/customer";
    setShowTestOptions(false);
  };

  return (
    <div className="px-5">
      <nav className="navbar navbar-expand-lg" style={{ 
        backgroundColor: '#1a1a1a', 
        borderBottom: '1px solid #333',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
      }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Brand on the left */}
          <a
            className="navbar-brand fw-bold fs-4 d-flex align-items-center"
            href="/"
            style={{ color: '#e0e0e0' }}
          >
            <img 
              src={logo} 
              alt="Logo" 
              className="me-2" 
              height="30"
              style={{ filter: 'brightness(1.2)' }} // Make logo slightly brighter in dark mode
            />
            Furniture<span style={{ color: "#58b6e6" }}>Store</span>
          </a>

          {/* Toggler for mobile view */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ 
              borderColor: '#444',
              backgroundColor: '#2d2d2d' 
            }}
          >
            <span className="navbar-toggler-icon" style={{ 
              filter: 'invert(1) brightness(0.8)' // Invert icon for dark mode
            }}></span>
          </button>

          {/* Collapsible content */}
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "home" ? "active" : ""
                  }`}
                  href="/#products"
                  onClick={() => handleTabClick("home")}
                  style={{ 
                    color: activeTab === "home" ? "#58b6e6" : "#e0e0e0"
                  }}
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "about" ? "active" : ""
                  }`}
                  href="/#about"
                  onClick={() => handleTabClick("about")}
                  style={{ 
                    color: activeTab === "about" ? "#58b6e6" : "#e0e0e0"
                  }}
                >
                  About
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "services" ? "active" : ""
                  }`}
                  href="/#services"
                  onClick={() => handleTabClick("services")}
                  style={{ 
                    color: activeTab === "services" ? "#58b6e6" : "#e0e0e0"
                  }}
                >
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "contact" ? "active" : ""
                  }`}
                  href="/#footer"
                  onClick={() => handleTabClick("contact")}
                  style={{ 
                    color: activeTab === "contact" ? "#58b6e6" : "#e0e0e0"
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Login/Logout button on the right */}
          <div className="d-none d-lg-block position-relative">
            {!user ? (
              <div>
                <button 
                  className="btn btn-primary px-4 py-2 shadow-sm" 
                  onClick={() => setShowTestOptions(!showTestOptions)}
                  style={{
                    backgroundColor: '#0d6efd',
                    borderColor: '#0a58ca'
                  }}
                >
                  Test Login Options
                  <IoMdLogIn className="ms-2" size={20} />
                </button>
                
                {showTestOptions && (
                  <div 
                    className="position-absolute shadow-lg rounded p-2 mt-1" 
                    style={{ 
                      right: 0, 
                      zIndex: 1000, 
                      minWidth: "200px",
                      backgroundColor: '#2d2d2d',
                      borderColor: '#444',
                      border: '1px solid #444' 
                    }}
                  >
                    <button 
                      className="btn btn-outline-primary w-100 mb-2 d-flex align-items-center justify-content-between"
                      onClick={loginAsAdmin}
                      style={{
                        color: '#63a4ff',
                        borderColor: '#0a58ca'
                      }}
                    >
                      <span>Login as Admin</span>
                      <FaUserCog />
                    </button>
                    <button 
                      className="btn btn-outline-success w-100 d-flex align-items-center justify-content-between"
                      onClick={loginAsCustomer}
                      style={{
                        color: '#4caf50',
                        borderColor: '#2e7d32'
                      }}
                    >
                      <span>Login as Customer</span>
                      <FaUser />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a 
                className="btn btn-primary px-4 py-2 shadow-sm" 
                href="/logout"
                style={{
                  backgroundColor: '#dc3545',
                  borderColor: '#b02a37'
                }}
              >
                Logout
                <IoMdLogOut className="ms-2" size={20} />
              </a>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;