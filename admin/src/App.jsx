import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

const App = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer />

      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/teacher" />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* ADMIN HOME (temporary) */}
        <Route
          path="/admin"
          element={
            isAuthenticated && role === "admin" ? (
              <h1>Admin Dashboard</h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* TEACHER HOME (temporary) */}
        <Route
          path="/teacher"
          element={
            isAuthenticated && role === "teacher" ? (
              <h1>Teacher Dashboard</h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* DEFAULT */}
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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;