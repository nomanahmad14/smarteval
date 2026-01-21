import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // "admin" | "teacher"
  const [loading, setLoading] = useState(true);

  // LOGOUT
  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  // AXIOS INSTANCE
  const authAxios = axios.create({
    baseURL: BACKEND_URL,
  });

  authAxios.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  authAxios.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
      return Promise.reject(err);
    }
  );

  // LOGIN
  const login = async ({ email, password, role }) => {
    try {
      const url =
        role === "admin"
          ? `${BACKEND_URL}/api/admin/login`
          : `${BACKEND_URL}/api/teacher/loginTeacher`;

      const res = await axios.post(url, { email, password });

      setToken(res.data.token);
      setRole(role);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // LOAD FROM STORAGE
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
        authAxios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
