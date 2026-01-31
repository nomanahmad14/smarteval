import { useContext, useEffect, useState } from "react";
import { TeacherContext } from "../../context/TeacherContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const {
    createQuiz,
    addQuestion,
    fetchMyQuestions,
    addQuestionsToQuiz,
    removeQuestionFromQuiz,
    publishQuiz,
    questions,
  } = useContext(TeacherContext);

  const [quizId, setQuizId] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const navigate = useNavigate();

  const [quizForm, setQuizForm] = useState({
    title: "",
    duration: "",
  });

  const [questionForm, setQuestionForm] = useState({
    ques: "",
    difficulty: "easy",
    correctAnswer: "a",
    options: { a: "", b: "", c: "", d: "" },
  });

  useEffect(() => {
    fetchMyQuestions();
  }, []);

  const selectedQuestionObjects = questions.filter(q =>
    selectedQuestions.includes(q._id)
  );

  const handleCreateQuiz = async () => {
    if (!quizForm.title || !quizForm.duration) {
      return toast.error("Title and duration required");
    }

    const res = await createQuiz(quizForm);
    if (res.success) {
      setQuizId(res.quizId);
      toast.success("Quiz created");
    } else {
      toast.error(res.message);
    }
  };

  const handleAddQuestion = async () => {
    if (!questionForm.ques) {
      return toast.error("Question is required");
    }

    const res = await addQuestion(questionForm);
    if (!res.success) {
      return toast.error(res.message);
    }

    const newQuestionId = res.questionId;

    await addQuestionsToQuiz(quizId, [newQuestionId]);

    setSelectedQuestions(prev => [...prev, newQuestionId]);

    setQuestionForm({
      ques: "",
      difficulty: "easy",
      correctAnswer: "a",
      options: { a: "", b: "", c: "", d: "" },
    });

    setShowQuestionForm(false);
    fetchMyQuestions();
    toast.success("Question added to quiz");
  };

  const toggleQuestion = async (questionId) => {
    if (!quizId) return;

    if (selectedQuestions.includes(questionId)) {
      await removeQuestionFromQuiz(quizId, questionId);
      setSelectedQuestions(prev =>
        prev.filter(id => id !== questionId)
      );
    } else {
      const res = await addQuestionsToQuiz(quizId, [questionId]);
      if (res.success) {
        setSelectedQuestions(prev => [...prev, questionId]);
      }
    }
  };

  const handlePublish = async () => {
    const res = await publishQuiz(quizId);
    if (res.success) {
      toast.success("Quiz published");
      navigate("/teacher");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl">

      {/* LEFT – CURRENT QUIZ */}
      <div className="bg-white rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">Current Quiz</h2>

        {!quizId && (
          <div className="space-y-4">
            <input
              className="input"
              placeholder="Quiz Title"
              value={quizForm.title}
              onChange={e =>
                setQuizForm({ ...quizForm, title: e.target.value })
              }
            />
            <input
              type="number"
              className="input"
              placeholder="Duration (minutes)"
              value={quizForm.duration}
              onChange={e =>
                setQuizForm({ ...quizForm, duration: e.target.value })
              }
            />
            <button
              onClick={handleCreateQuiz}
              className="bg-[#006d5b] text-white px-6 py-2 rounded-lg"
            >
              Create Quiz
            </button>
          </div>
        )}

        {quizId && (
          <>
            {selectedQuestionObjects.map((q, i) => (
              <div
                key={q._id}
                className="border rounded-lg p-4 bg-gray-50 flex justify-between"
              >
                <div>
                  <p className="font-medium">
                    {i + 1}. {q.ques}
                  </p>
                  <p className="text-xs text-gray-500">
                    Difficulty: {q.difficulty}
                  </p>
                </div>
                <button
                  onClick={() => toggleQuestion(q._id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={() => setShowQuestionForm(!showQuestionForm)}
              className="border px-4 py-2 rounded-lg w-fit"
            >
              + Add New Question
            </button>

            {showQuestionForm && (
              <div className="border rounded-lg p-4 space-y-3">
                <textarea
                  className="input"
                  placeholder="Question"
                  value={questionForm.ques}
                  onChange={e =>
                    setQuestionForm({ ...questionForm, ques: e.target.value })
                  }
                />

                {["a", "b", "c", "d"].map(opt => (
                  <input
                    key={opt}
                    className="input"
                    placeholder={`Option ${opt}`}
                    value={questionForm.options[opt]}
                    onChange={e =>
                      setQuestionForm({
                        ...questionForm,
                        options: {
                          ...questionForm.options,
                          [opt]: e.target.value,
                        },
                      })
                    }
                  />
                ))}

                <select
                  className="input"
                  value={questionForm.correctAnswer}
                  onChange={e =>
                    setQuestionForm({
                      ...questionForm,
                      correctAnswer: e.target.value,
                    })
                  }
                >
                  <option value="a">Correct: A</option>
                  <option value="b">Correct: B</option>
                  <option value="c">Correct: C</option>
                  <option value="d">Correct: D</option>
                </select>

                <select
                  className="input"
                  value={questionForm.difficulty}
                  onChange={e =>
                    setQuestionForm({
                      ...questionForm,
                      difficulty: e.target.value,
                    })
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <button
                  onClick={handleAddQuestion}
                  className="bg-[#006d5b] text-white px-4 py-2 rounded-lg"
                >
                  Save Question
                </button>
              </div>
            )}

            <button
              onClick={handlePublish}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Publish Quiz
            </button>
          </>
        )}
      </div>

      {/* RIGHT – ALL QUESTIONS */}
      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Your Questions</h2>

        {questions.map(q => (
          <label
            key={q._id}
            className="flex gap-3 p-3 border rounded-lg mb-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedQuestions.includes(q._id)}
              onChange={() => toggleQuestion(q._id)}
            />
            <div>
              <p className="font-medium">{q.ques}</p>
              <p className="text-xs text-gray-500">
                Difficulty: {q.difficulty}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CreateQuiz;
