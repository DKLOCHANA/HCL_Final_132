import React, { createContext, useState, useEffect } from "react";
import { auth } from "../../Backend/firebase";
import { onAuthStateChanged } from "firebase/auth";



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setUser(true);
        // Default to customer role for now
        setRole("customer");
        setLoading(false);
      } else {
        setUser(false);
        setRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    user,
    setUser,
    role,
    setRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};