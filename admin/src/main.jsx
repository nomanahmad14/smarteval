import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  // Prevent UI flicker while auth loads from localStorage
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          }
        />

        {/* Temporary Home Route (placeholder) */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="p-6 text-lg font-semibold">
                Logged in successfully
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;