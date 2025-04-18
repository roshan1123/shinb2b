import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import B2BUploader from "./components/B2BUploader"; // This is your B2B component
import AuthRoute from "./components/AuthRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboards */}
        <Route
          path="/user-dashboard"
          element={
            <AuthRoute requiredRole="User">
              <UserDashboard />
            </AuthRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <AuthRoute requiredRole="Admin">
              <AdminDashboard />
            </AuthRoute>
          }
        />

        {/* B2B Uploader route, protected for Admin only */}
        <Route
          path="/b2b-uploader"
          element={
            <AuthRoute requiredRole="Admin">
              <B2BUploader />
            </AuthRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
