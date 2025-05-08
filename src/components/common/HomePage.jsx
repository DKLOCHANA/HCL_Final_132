import React from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaChair } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="container">
      <header className="py-5 text-center">
        <h1 className="display-4 mb-3">
          <FaChair className="me-3" /> Furniture Designer Store
        </h1>
        <p className="lead">Design your perfect space with our exclusive furniture collection</p>
        <div className="mt-4">
          <Link to="/login" className="btn btn-primary me-3">
            <FaSignInAlt className="me-2" /> Login
          </Link>
          <Link to="/register" className="btn btn-outline-primary">
            <FaUserPlus className="me-2" /> Register
          </Link>
        </div>
      </header>

      <div className="row py-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">Design Your Space</h3>
              <p className="card-text">
                Use our interactive Room Planner Pro to design and visualize your ideal living space.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">Premium Collection</h3>
              <p className="card-text">
                Explore our premium collection of furniture, designed for comfort and style.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">Expert Advice</h3>
              <p className="card-text">
                Get advice from our interior design experts to make the perfect choice for your home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
