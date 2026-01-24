import { NavLink } from "react-router-dom";

const Sidebar = ({ open, setOpen }) => {
  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Add Teacher", path: "/admin/add-teacher" },
    { name: "Add Subject", path: "/admin/add-subject" },
    { name: "All Teachers", path: "/admin/all-teachers" },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 text-lg font-semibold text-[#006d5b]">
          Admin Panel
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-[#006d5b]/10 text-[#006d5b]"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;