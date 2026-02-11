import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const handleLogin = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    setToken(token);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <Navbar role={role} onLogout={logout} />

      <Routes>

        {/* 🔥 role based dashboard */}
        <Route
          path="/"
          element={
            role === "admin"
              ? <Dashboard />
              : <EmployeeDashboard />
          }
        />

        {/* admin only page */}
        {role === "admin" && (
          <Route path="/employees" element={<Employees />} />
        )}

        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
