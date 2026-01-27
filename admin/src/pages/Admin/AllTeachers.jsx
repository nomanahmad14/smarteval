import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DEFAULT_IMAGE =
  "https://via.placeholder.com/80?text=Teacher";

const AllTeachers = () => {
  const { fetchAllTeachers, teachers, loading } =
    useContext(AdminContext);

  useEffect(() => {
    fetchAllTeachers();
  }, []);

  if (loading) {
    return <div className="p-8 text-lg">Loading teachers...</div>;
  }

  return (
    <div className="px-6 md:px-10 py-6 max-w-7xl">

      {teachers.length === 0 ? (
        <p className="text-gray-500 text-lg">
          No teachers found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-md transition p-4 flex items-center gap-4"
            >
              {/* IMAGE */}
              <img
                src={teacher.image || DEFAULT_IMAGE}
                alt={teacher.name}
                className="w-20 h-20 rounded-lg object-cover border bg-gray-100"
              />

              {/* INFO */}
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-800">
                  {teacher.name}
                </p>

                <p className="text-sm text-gray-500">
                  {typeof teacher.subject === "object"
                    ? teacher.subject?.name
                    : "Subject not assigned"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTeachers;