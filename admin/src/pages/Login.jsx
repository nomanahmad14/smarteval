import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    const result = await login({ email, password, role });

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success("Login successful");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center justify-center bg-[#f8fafc]"
    >
      <div className="flex flex-col gap-5 w-[420px] p-10 bg-white border rounded-2xl shadow-xl text-[#5E5E5E] text-base">
        <p className="text-3xl font-semibold text-center">
          <span className="capitalize text-[#006d5b]">{role}</span> Login
        </p>

        <div className="w-full">
          <p className="mb-1">Email</p>
          <input
            type="email"
            className="border border-[#DADADA] rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-[#006d5b]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-1">Password</p>
          <input
            type="password"
            className="border border-[#DADADA] rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-[#006d5b]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#006d5b] text-white font-semibold w-full py-3 rounded-lg text-lg hover:opacity-90 transition"
        >
          Login
        </button>

        {role === "admin" ? (
          <p className="text-center">
            Teacher Login?{" "}
            <span
              className="text-[#006d5b] underline cursor-pointer font-medium"
              onClick={() => setRole("teacher")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="text-center">
            Admin Login?{" "}
            <span
              className="text-[#006d5b] underline cursor-pointer font-medium"
              onClick={() => setRole("admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
