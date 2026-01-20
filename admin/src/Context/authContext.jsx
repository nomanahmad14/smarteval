import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // "admin" | "teacher"
  const [loading, setLoading] = useState(true);


  // LOGOUT (used everywhere)

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.clear();
  };

  // AXIOS INSTANCE (AUTH)
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
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        
        logout();
      }
      return Promise.reject(error);
    }
  );

  // LOGIN (ADMIN / TEACHER)
  
  const login = async ({ email, password, role }) => {
    try {
      let url = "";

      if (role === "admin") {
        url = `${BACKEND_URL}/api/admin/login`;
      } else if (role === "teacher") {
        url = `${BACKEND_URL}/api/teacher/loginTeacher`;
      } else {
        throw new Error("Invalid role");
      }

      const res = await axios.post(url, { email, password });

      const receivedToken = res.data.token;
      const receivedUser =
        role === "admin" ? res.data.admin : res.data.teacher;

      setToken(receivedToken);
      setUser(receivedUser);
      setRole(role);

      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(receivedUser));
      localStorage.setItem("role", role);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message || "Login failed",
      };
    }
  };

  // LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
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