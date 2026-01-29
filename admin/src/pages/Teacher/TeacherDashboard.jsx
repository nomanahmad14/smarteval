import { useContext, useEffect, useState } from "react";
import { TeacherContext } from "../../context/TeacherContext";
import { toast } from "react-toastify";

const TeacherDashboard = () => {
  const { getTeacherDashboard, publishQuiz, loading } =
    useContext(TeacherContext);

  const [data, setData] = useState(null);

  const loadDashboard = async () => {
    const res = await getTeacherDashboard();
    if (res?.success) {
      setData(res.dashboard);
    } else {
      toast.error(res?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handlePublish = async (quizId) => {
    const res = await publishQuiz(quizId);
    if (res.success) {
      toast.success("Quiz published");
      loadDashboard();
    } else {
      toast.error(res.message);
    }
  };

  if (!data) {
    return <div className="p-6 text-lg">Loading dashboard...</div>;
  }

  return (
    <div className="px-6 md:px-10 py-8 space-y-10">

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Quizzes" value={data.totalQuizzes} />
        <StatCard title="Published" value={data.publishedQuizzes} />
        <StatCard title="Unpublished" value={data.unpublishedQuizzes} />
      </div>

      {/* UNPUBLISHED QUIZZES */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Unpublished Quizzes
        </h2>

        {data.unpublishedQuizzes === 0 ? (
          <p className="text-gray-500">No unpublished quizzes</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.quizzes
              .filter((q) => !q.isPublished)
              .map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white rounded-xl border shadow-sm p-6 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Duration: {quiz.duration} min
                    </p>
                    <p className="text-sm text-gray-500">
                      Questions: {quiz.totalMarks || 0}
                    </p>
                  </div>

                  <button
                    disabled={loading}
                    onClick={() => handlePublish(quiz._id)}
                    className="mt-4 bg-[#006d5b] text-white py-2 rounded-lg hover:opacity-90"
                  >
                    Publish
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* PUBLISHED QUIZZES */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Published Quizzes
        </h2>

        {data.publishedQuizzes === 0 ? (
          <p className="text-gray-500">No published quizzes</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.quizzes
              .filter((q) => q.isPublished)
              .map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white rounded-xl border shadow-sm p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Duration: {quiz.duration} min
                  </p>
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    Published
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-[#006d5b] mt-2">
        {value}
      </h2>
    </div>
  );
};

export default TeacherDashboard;
