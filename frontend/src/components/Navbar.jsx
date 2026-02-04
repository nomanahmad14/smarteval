import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AppContext";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass =
    "px-3 py-2 hover:text-blue-600 transition font-medium";

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer text-blue-600"
        >
          SmartEval
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/my-work" className={linkClass}>My Work</NavLink>

          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
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
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={logout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
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
          className="md:hidden text-2xl"
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
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Login
              </button>
            ) : (
              <>
                <p
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-red-500"
                >
                  Logout
                </p>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;