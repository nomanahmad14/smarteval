import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AppContext";

const About = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <section className="bg-[#f7faf9]">
      <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
            About Us
          </p>

          <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-snug">
            Helping students succeed through{" "}
            <span className="text-[#006D5E]">
              smart evaluation
            </span>.
          </h1>

          <p className="text-gray-600 mb-4 leading-relaxed">
            SmartEval is an online quiz and evaluation platform designed
            to make learning more structured, measurable, and effective.
            We help students test their knowledge, track performance,
            and identify gaps through well-designed quizzes.
          </p>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Our goal is to simplify assessments and provide meaningful
            insights that support continuous learning and improvement —
            without unnecessary complexity.
          </p>

          {!isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#006D5E] text-white px-6 py-3 rounded hover:opacity-90"
            >
              Get Started for Free
            </button>
          )}
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative flex justify-center">
          <div className="w-80 h-80 rounded-full bg-[#006D5E]/20 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-white shadow flex items-center justify-center text-center px-6">
              <div>
                <h3 className="text-lg font-semibold text-[#006D5E] mb-2">
                  Smart Learning
                </h3>
                <p className="text-sm text-gray-500">
                  Assess • Analyze • Improve
                </p>
              </div>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="absolute bottom-6 left-6 w-20 h-20 bg-[#006D5E]/10 rounded-full"></div>
          <div className="absolute top-6 right-6 w-12 h-12 bg-[#006D5E]/20 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default About;