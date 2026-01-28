import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const { role, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white h-16">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-xl font-bold text-[#006d5b]">
            SmartEval
          </h1>

          <span className="hidden sm:inline px-3 py-1 rounded-full text-sm border border-[#006d5b] text-[#006d5b] capitalize">
            {role}
          </span>
        </div>

        <button
          onClick={logout}
          className="bg-[#006d5b] text-white px-5 py-2 rounded-full text-sm"
        >
          Logout
        </button>
      </div>

      <Sidebar open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;
