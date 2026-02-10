import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AppContext";

const Login = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const { data } = await axios.post("/user/login", {
          email,
          password,
        });

        setToken(data.token);
        navigate("/");
      } else {
        // REGISTER (NO IMAGE)
        const { data } = await axios.post("/user/register", {
          name,
          email,
          password,
        });

        setToken(data.token);
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="w-full max-w-md border rounded-lg p-6 shadow-sm">

        <h2 className="text-2xl font-bold text-center text-[#006D5E] mb-4">
          {isLogin ? "Login to SmartEval" : "Create your SmartEval account"}
        </h2>

        {error && (
          <p className="text-sm text-red-500 mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="text-sm">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="text-sm">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-5">
            <label className="text-sm">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006D5E] text-white py-2 rounded hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        {/* Toggle text */}
        <p className="text-sm text-center mt-4">
          {isLogin ? (
            <>
              New user?{" "}
              <span
                onClick={() => setIsLogin(false)}
                className="text-[#006D5E] cursor-pointer font-medium"
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already registered?{" "}
              <span
                onClick={() => setIsLogin(true)}
                className="text-[#006D5E] cursor-pointer font-medium"
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
