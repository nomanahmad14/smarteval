import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AppContextProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = Boolean(token);

  // axios config
  axios.defaults.baseURL = "http://localhost:5000/api";

  // fetch logged-in user
  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get("/user/profile");
      setUser(data.user);
    } catch (error) {
      console.log("Auth failed, logging out");
      logout();
    } finally {
      setLoading(false);
    }
  };

  // logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // sync token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const value = {
    token,
    setToken,
    user,
    isLoggedIn,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AppContextProvider;