import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

import Navbar from "./components/Navbar";

import AdminProvider from "./context/AdminContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddTeacher from "./pages/admin/AddTeacher";
import AddSubject from "./pages/admin/AddSubject";
import AllTeachers from "./pages/admin/AllTeachers";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import CreateQuiz from "./pages/teacher/CreateQuiz";

const App = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      <ToastContainer />
      {isAuthenticated && <Navbar />}

      <Routes>
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

        <Route
          path="/teacher/*"
          element={
            isAuthenticated && role === "teacher" ? (
              <div className="pt-16 pl-64">
                <Routes>
                  <Route index element={<TeacherDashboard />} />
                  <Route path="profile" element={<TeacherProfile />} />
                  <Route path="create-quiz" element={<CreateQuiz />} />
                </Routes>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

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
