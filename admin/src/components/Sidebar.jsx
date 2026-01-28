import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ open, setOpen }) => {
  const { role } = useAuth();

  const adminLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Add Teacher", path: "/admin/add-teacher" },
    { name: "Add Subject", path: "/admin/add-subject" },
    { name: "All Teachers", path: "/admin/all-teachers" },
  ];

  const teacherLinks = [
    { name: "Dashboard", path: "/teacher" },
    { name: "Profile", path: "/teacher/profile" },
    { name: "Create Quiz", path: "/teacher/create-quiz" },
  ];

  const links = role === "admin" ? adminLinks : teacherLinks;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          bg-white border-r w-64 z-40
          fixed top-16 h-[calc(100vh-4rem)]
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-6 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 capitalize">
            {role} Panel
          </h2>

          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-base font-medium ${
                  isActive
                    ? "bg-[#006d5b]/10 text-[#006d5b]"
                    : "hover:bg-[#006d5b]/10"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;