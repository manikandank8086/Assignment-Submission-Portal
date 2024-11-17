import React from "react";

import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "./pages/user/Register";
import UserLogin from "./pages/user/Login";
import AdminRegister from "./pages/admin/Register";
import AdminLogin from "./pages/admin/Login";
import UserHome from "./pages/user/Home";
import AdminDashboard from "./pages/admin/Dashbord";
import PrivateRoute from "./middleware/PrivateRoute";
import ProtectedRoute from "./middleware/ProtectRoute";
import AdminProtectedRoute from "./middleware/AdminProtectRoute";
import AdminPrivateRoute from "./middleware/AdminPrivateRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* User routes */}
          <Route
            path="/register"
            element={
              <PrivateRoute>
                <UserRegister />
              </PrivateRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PrivateRoute>
                <UserLogin />
              </PrivateRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <UserHome />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/register"
            element={
              <AdminPrivateRoute>
                <AdminRegister />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="/admin/login"
            element={
              <AdminPrivateRoute>
                <AdminLogin />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="/admin/dashbord"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
