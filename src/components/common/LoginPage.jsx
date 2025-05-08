import React, { useState, useContext } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/authContext.jsx";
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from "../../../Backend/firebase";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser, setRole } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check for custom claims to determine role
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role || "customer";
      
      // Update context
      setUser(true);
      setRole(role);
      
      // Show success message
      setMessage("Login successful! Redirecting...");
      setMessageType("success");
      
      // Navigate to appropriate dashboard
      setTimeout(() => {
        navigate(role === "admin" ? "/admin" : "/customer");
      }, 1000);
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific Firebase auth errors
      let errorMessage = "Login failed. Please check your credentials.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid login credentials";
      }
      
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage("Password reset email sent! Please check your inbox.");
      setMessageType("success");
      setShowResetForm(false);
    } catch (error) {
      console.error("Password reset error:", error);
      setMessage("Failed to send reset email. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="row shadow rounded overflow-hidden"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        {/* Image Section */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="src/assets/login.jpg"
            alt="Login Visual"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>
  
        {/* Form Section */}
        <div className="col-md-6 bg-white p-5">
          <h3 className="mb-4 text-center">Welcome Back</h3>
          {message && (
            <div className={`alert alert-${messageType === "error" ? "danger" : "success"} mb-3`}>
              {message}
            </div>
          )}
          
          {showResetForm ? (
            // Password Reset Form
            <div>
              <p className="mb-3 text-center">Enter your email address to receive a password reset link.</p>
              <form onSubmit={handlePasswordReset}>
                <div className="form-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowResetForm(false)}
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Login Form
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  <FaSignInAlt className="me-2" />
                )}
                {loading ? "Logging in..." : "Log In"}
              </button>
              <div className="text-center mt-3">
                <a href="#" className="text-primary" onClick={(e) => {
                  e.preventDefault();
                  setShowResetForm(true);
                }}>
                  Forgot Password?
                </a>
              </div>
              <div className="text-center mt-3">
              Don't have an account?{" "}
              <a href="/register" className="text-primary">
                Register
              </a>
            </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;