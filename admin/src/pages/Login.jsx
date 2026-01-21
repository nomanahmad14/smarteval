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

    const result = await login({
      email,
      password,
      role,
    });

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success("Login successful");
      
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-[#5f6FFF] capitalize">
            {role}
          </span>{" "}
          Login
        </p>

        {/* Email */}
        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base"
        >
          Login
        </button>

        {/* Toggle role */}
        {role === "admin" ? (
          <p>
            Teacher Login?{" "}
            <span
              className="text-[#5f6FFF] underline cursor-pointer"
              onClick={() => setRole("teacher")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-[#5f6FFF] underline cursor-pointer"
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
