import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

import Navbar from "./components/Navbar";

import AdminProvider from "./context/AdminContext";
import AdminDashboard from "./pages/Admin/AdminDashboard"
import AddTeacher from "./pages/admin/AddTeacher";
import AddSubject from "./pages/admin/AddSubject";
import AllTeachers from "./pages/admin/AllTeachers";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";

const App = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      <ToastContainer />

      {/* Navbar + Sidebar */}
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

        {/* ADMIN ROUTES */}
        <Route
  path="/admin/*"
  element={
    isAuthenticated && role === "admin" ? (
      <AdminProvider>
       <div className="pt-16 pl-64">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="add-teacher" element={<AddTeacher />} />
            <Route path="add-subject" element={<AddSubject />} />
            <Route path="all-teachers" element={<AllTeachers />} />
          </Routes>
     </div>
      </AdminProvider>
    ) : (
      <Navigate to="/login" />
    )
  }
/>


        {/* TEACHER ROUTES */}
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
