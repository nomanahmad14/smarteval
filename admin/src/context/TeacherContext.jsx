import { createContext, useState } from "react";
import { useAuth } from "./AuthContext";

export const TeacherContext = createContext();

const TeacherProvider = ({ children }) => {
  const { authAxios } = useAuth();

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);

  const getTeacherProfile = async () => {
    try {
      setLoading(true);
      const { data } = await authAxios.get("/api/teacher/profile");
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load profile",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateTeacherProfile = async (formData) => {
    try {
      const { data } = await authAxios.put(
        "/api/teacher/profile/update",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error updating profile",
      };
    }
  };

  const addQuestion = async (payload) => {
    try {
      const { data } = await authAxios.post(
        "/api/teacher/addQuestion",
        payload
      );
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error adding question",
      };
    }
  };

  const fetchQuestionsBySubject = async (subjectId) => {
    try {
      setLoading(true);
      const { data } = await authAxios.get(
        `/api/teacher/questions?subjectId=${subjectId}`
      );
      if (data.success) {
        setQuestions(data.questions);
      }
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (payload) => {
    try {
      const { data } = await authAxios.post(
        "/api/teacher/quiz/create",
        payload
      );
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error creating quiz",
      };
    }
  };

  const getQuizById = async (quizId) => {
    try {
      setLoading(true);
      const { data } = await authAxios.get(
        `/api/teacher/quiz/${quizId}`
      );
      if (data.success) {
        setQuiz(data.quiz);
      }
    } finally {
      setLoading(false);
    }
  };

  const addQuestionsToQuiz = async (quizId, questionIds) => {
    try {
      const { data } = await authAxios.post(
        `/api/teacher/quiz/${quizId}/addQuestions`,
        { questionIds }
      );
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error adding questions",
      };
    }
  };

  const removeQuestionFromQuiz = async (quizId, questionId) => {
    try {
      const { data } = await authAxios.delete(
        `/api/teacher/quiz/${quizId}/removeQuestion/${questionId}`
      );
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error removing question",
      };
    }
  };

  const publishQuiz = async (quizId) => {
    try {
      const { data } = await authAxios.post(
        `/api/teacher/quiz/${quizId}/publish`
      );
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error publishing quiz",
      };
    }
  };

  return (
    <TeacherContext.Provider
      value={{
        loading,
        questions,
        quiz,
        getTeacherProfile,
        updateTeacherProfile,
        addQuestion,
        fetchQuestionsBySubject,
        createQuiz,
        getQuizById,
        addQuestionsToQuiz,
        removeQuestionFromQuiz,
        publishQuiz,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export default TeacherProvider;
