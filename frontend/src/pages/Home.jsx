import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AppContext";

const Home = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const subjectRef = useRef(null);

  const scrollToSubjects = () => {
    subjectRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    let ignore = false;

    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:4000/api/user/subjects",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        if (!ignore) {
          setSubjects(data.subjects || []);
        }
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchSubjects();

    return () => {
      ignore = true;
    };
  }, [isLoggedIn, user]);

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-b from-[#006D5E]/10 to-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-[#006D5E] mb-4">
            SmartEval
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            SmartEval helps students assess knowledge, track progress,
            and improve learning through structured quizzes.
          </p>

          {isLoggedIn ? (
            <button
              onClick={scrollToSubjects}
              className="bg-[#006D5E] text-white px-6 py-3 rounded"
            >
              Explore Subjects
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#006D5E] text-white px-6 py-3 rounded"
            >
              Login to Get Started
            </button>
          )}
        </div>
      </section>

      {/* SUBJECTS */}
      <section ref={subjectRef} className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[#006D5E] mb-6">
          Subjects
        </h2>

        {!isLoggedIn && (
          <div className="border rounded p-6 text-center">
            <p className="mb-4">
              Please login to view available subjects.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#006D5E] text-white px-5 py-2 rounded"
            >
              Login
            </button>
          </div>
        )}

        {isLoggedIn && loading && (
          <p className="text-gray-500">Loading subjects…</p>
        )}

        {isLoggedIn && !loading && subjects.length === 0 && (
          <p className="text-gray-500">No subjects available.</p>
        )}

        {isLoggedIn && subjects.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                onClick={() =>
                  navigate(`/subject/${subject._id}`, {
                    state: { subjectName: subject.name },
                  })
                }
                className="border rounded-lg p-5 cursor-pointer hover:shadow-md hover:border-[#006D5E]"
              >
                <h3 className="text-lg font-semibold">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-500">
                  View quizzes →
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
