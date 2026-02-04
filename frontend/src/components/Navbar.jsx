import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AppContext";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass =
    "px-3 py-2 text-gray-700 hover:text-[#006D5E] font-medium";

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LEFT: Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer text-[#006D5E]"
        >
          SmartEval
        </div>

        {/* RIGHT: Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/my-work" className={linkClass}>My Work</NavLink>

          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#006D5E] text-white px-5 py-2 rounded"
            >
              Login
            </button>
          ) : (
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-2">
                <img
                  src={user?.image || "/avatar.png"}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{user?.name}</span>
              </div>

              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border rounded shadow w-40">
                <p
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  My Profile
                </p>
                <p
                  onClick={logout}
                  className="px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </ul>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl text-[#006D5E]"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <ul className="flex flex-col items-center gap-4 py-4">
            <NavLink onClick={() => setOpen(false)} to="/">Home</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/about">About</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/my-work">My Work</NavLink>

            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="bg-[#006D5E] text-white px-6 py-2 rounded"
              >
                Login
              </button>
            ) : (
              <>
                <p onClick={() => navigate("/profile")}>My Profile</p>
                <p onClick={logout} className="text-red-500">Logout</p>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;