import { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AppContext";

const SubjectQuizzes = () => {
  const { subjectId } = useParams();
  const { state } = useLocation();
  const { getQuizzesBySubject } = useContext(AuthContext);
  const navigate = useNavigate();

  const [attempted, setAttempted] = useState([]);
  const [unattempted, setUnattempted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAttempted, setShowAttempted] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzesBySubject(subjectId);
        setAttempted(data.attemptedQuizzes || []);
        setUnattempted(data.newQuizzes || []);
      } catch (error) {
        console.error("Failed to load quizzes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [subjectId, getQuizzesBySubject]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading quizzes...
      </div>
    );
  }

  const quizzesToShow = showAttempted ? attempted : unattempted;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#006D5E]">
          {state?.subjectName || "Subject Quizzes"}
        </h1>

        <button
          onClick={() => setShowAttempted(!showAttempted)}
          className="border border-[#006D5E] text-[#006D5E] px-5 py-2 rounded hover:bg-[#006D5E] hover:text-white transition"
        >
          {showAttempted
            ? "View Unattempted Quizzes"
            : "View Attempted Quizzes"}
        </button>
      </div>

      {/* EMPTY STATE */}
      {quizzesToShow.length === 0 && (
        <p className="text-gray-500">
          {showAttempted
            ? "No attempted quizzes yet."
            : "No new quizzes available."}
        </p>
      )}

      {/* QUIZ GRID */}
      {quizzesToShow.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quizzesToShow.map((quiz) => (
            <div
              key={quiz._id}
              className="border rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition"
              style={{ aspectRatio: "3 / 2" }}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {quiz.title}
                </h3>

                <p className="text-sm text-gray-500">
                  Duration: {quiz.duration} mins
                </p>
              </div>

              <div className="mt-4">
                {!showAttempted ? (
                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                    className="w-full bg-[#006D5E] text-white py-2 rounded hover:opacity-90"
                  >
                    Start Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/result/${quiz._id}`)}
                    className="w-full border border-[#006D5E] text-[#006D5E] py-2 rounded hover:bg-[#006D5E] hover:text-white transition"
                  >
                    View Result
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectQuizzes;
