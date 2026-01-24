import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 sm:px-10 py-4 border-b bg-white">
      
      
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold text-[#006d5b]">
          SmartEval
        </div>

        <span className="px-3 py-1 text-sm rounded-full border border-[#006d5b] text-[#006d5b] capitalize">
          {role}
        </span>
      </div>

      
      <button
        onClick={handleLogout}
        className="bg-[#006d5b] text-white text-sm px-6 py-2 rounded-full hover:opacity-90 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
