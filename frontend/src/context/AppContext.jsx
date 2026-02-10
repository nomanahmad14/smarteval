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

  // ---------------- AXIOS SETUP ----------------
  axios.defaults.baseURL = "http://localhost:4000/api";

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      localStorage.setItem("token", token);
      fetchMyProfile();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // ---------------- AUTH ----------------
  const login = async (email, password) => {
    const { data } = await axios.post("/user/login", {
      email,
      password,
    });
    setToken(data.token);
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post("/user/register", {
      name,
      email,
      password,
    });
    setToken(data.token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  // ---------------- PROFILE ----------------
  const fetchMyProfile = async () => {
    try {
      const { data } = await axios.get("/user/profile");
      setUser(data.user);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    const { data } = await axios.put(
      "/user/profile/update",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    setUser(data.user);
    return data;
  };

  // ---------------- SUBJECTS ----------------
  const getSubjects = async () => {
    const { data } = await axios.get("/user/subjects");
    return data.subjects;
  };

  // ---------------- QUIZZES ----------------
  const getQuizzesBySubject = async (subjectId) => {
    const { data } = await axios.get(
      `/user/subjects/${subjectId}/quizzes`
    );
    return data;
  };

  const startQuiz = async (quizId) => {
    const { data } = await axios.post(
      `/user/quiz/${quizId}/start`
    );
    return data;
  };

  const getAttemptDetails = async (attemptId) => {
    const { data } = await axios.get(
      `/user/attempt/${attemptId}`
    );
    return data;
  };

  const submitQuiz = async (attemptId, answers) => {
    const { data } = await axios.post(
      `/user/attempt/${attemptId}/submit`,
      { answers }
    );
    return data;
  };

  const autoSubmitQuiz = async (attemptId, answers) => {
    const { data } = await axios.post(
      `/user/attempt/${attemptId}/auto-submit`,
      { answers }
    );
    return data;
  };

  const getAttemptResult = async (attemptId) => {
    const { data } = await axios.get(
      `/user/attempt/${attemptId}/result`
    );
    return data;
  };

  const getMyAttempts = async () => {
    const { data } = await axios.get("/user/attempts");
    return data.attempts;
  };

  // ---------------- CONTEXT VALUE ----------------
  const value = {
    // state
    user,
    token,
    isLoggedIn,
    loading,

    // auth
    login,
    register,
    logout,

    // profile
    updateProfile,

    // subjects & quizzes
    getSubjects,
    getQuizzesBySubject,
    startQuiz,

    // attempts
    getAttemptDetails,
    submitQuiz,
    autoSubmitQuiz,
    getAttemptResult,
    getMyAttempts,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AppContextProvider;
