import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

import Navbar from "./components/Navbar";

import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProvider from "./context/AdminContext";


const App = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer />

      {/* Navbar only when logged in */}
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={role === "admin" ? "/admin" : "/teacher"} />
            ) : (
              <Login />
            )
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            isAuthenticated && role === "admin" ? (
              <AdminProvider>
                <AdminDashboard />
              </AdminProvider>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* TEACHER DASHBOARD */}
        <Route
          path="/teacher"
          element={
            isAuthenticated && role === "teacher" ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ROOT */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={role === "admin" ? "/admin" : "/teacher"} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
