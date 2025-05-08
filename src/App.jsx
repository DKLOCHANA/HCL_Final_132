import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./components/common/LoginPage";
import RegisterPage from "./components/common/RegisterPage";
import LogoutPage from "./components/common/LogoutPage";
import CustomerDashboard from "./components/DesignerPage/3D_Design";
import UnauthorizedPage from "./components/common/UnauthorizedPage";
import HomePage from "./components/common/HomePage";
import DebugAuth from "./components/common/DebugAuth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/debug" element={<DebugAuth />} />
        
        {/* Temporarily make this route accessible without protection */}
        <Route path="/customer/*" element={<CustomerDashboard />} />
        
        {/* Restore this after fixing authentication */}
        {/* <Route 
          path="/customer/*" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        /> */}
      </Routes>
    </Router>
  );
}

export default App;