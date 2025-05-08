import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/authContext.jsx";
import { auth, signOut } from "../../../Backend/firebase";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { setUser, setRole } = useContext(AuthContext);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Sign out with Firebase
        await signOut(auth);
        
        // Clear any stored tokens
        localStorage.removeItem("authToken");
        
        // Reset user context
        setUser(false);
        setRole(null);
        
        // Navigate to login page with a short delay to show logout message
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        console.error("Logout error:", error);
        // Even if there's an error, try to navigate back to homepage
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    };
    
    performLogout();
  }, [navigate, setUser, setRole]);

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="p-4 text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3>Logging out...</h3>
        <p className="text-muted">Thank you for using our service.</p>
      </div>
    </div>
  );
};

export default LogoutPage;