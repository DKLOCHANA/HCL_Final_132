import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { auth, createUserWithEmailAndPassword, db } from "../../../Backend/firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    phone: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Reset messages
    setMessage("");
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password should be at least 6 characters");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });
      
      // Save additional user data to Firestore "designers" collection
      await setDoc(doc(db, "designers", user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company || "",
        phone: formData.phone || "",
        role: "customer", // Designer role
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        designs: [] // Empty array to store design IDs
      });

      setMessage("Registration successful! Redirecting to login...");
      setMessageType("success");
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific Firebase auth errors
      let errorMessage = "Registration failed. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email is already in use. Please use a different email or try to login.";
      }
      
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="row shadow rounded overflow-hidden"
        style={{ maxWidth: "1000px", width: "100%" }}
      >
        {/* Image Section */}
        <div className="col-md-5 d-none d-md-block p-0">
          <img
            src="src\assets\register.jpg" // Replace with your image path
            alt="Sign Up Visual"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Form Section */}
        <div className="col-md-7 bg-white p-5">
          <h3 className="mb-4 text-center">Create Your Designer Account</h3>
          
          {message && (
            <div className={`alert alert-${messageType === "error" ? "danger" : "success"} mb-3`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company (Optional)"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone Number (Optional)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <small className="form-text text-muted">
                Password must be at least 6 characters
              </small>
            </div>

            <div className="form-group mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <FaUserPlus className="me-2" />
              )}
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="text-center mt-3">
              Already have an account?{" "}
              <a href="/login" className="text-primary">
                Log In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;