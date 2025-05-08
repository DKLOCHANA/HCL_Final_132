import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";  // Add Bootstrap import
import "./app.css";  // Import your global CSS
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./utils/authContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);