import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
} from "react-icons/fa";

const AdminDashboard = () => {
  const adminCtx = useContext(AdminContext);
  if (!adminCtx) return null;

  const {
    dashboardData,
    subjects,
    loading,
    fetchDashboardData,
    fetchSubjects,
  } = adminCtx;

  useEffect(() => {
    fetchDashboardData();
    fetchSubjects();
  }, []);

  if (loading || !dashboardData) {
    return <div className="p-8 text-lg">Loading dashboard...</div>;
  }

  return (
    <div className="w-full px-8 md:px-12 py-8 space-y-12">
      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl">
        {/* Teachers */}
        <div className="bg-white rounded-2xl shadow p-8 flex items-center gap-6 h-40">
          <div className="h-20 w-20 flex items-center justify-center rounded-xl bg-[#006d5b]/10 text-[#006d5b]">
            <FaChalkboardTeacher size={36} />
          </div>
          <div>
            <p className="text-gray-500 text-base">Teachers</p>
            <h2 className="text-4xl font-bold">
              {dashboardData.teachers}
            </h2>
          </div>
        </div>

        {/* Students */}
        <div className="bg-white rounded-2xl shadow p-8 flex items-center gap-6 h-40">
          <div className="h-20 w-20 flex items-center justify-center rounded-xl bg-[#006d5b]/10 text-[#006d5b]">
            <FaUserGraduate size={36} />
          </div>
          <div>
            <p className="text-gray-500 text-base">Students</p>
            <h2 className="text-4xl font-bold">
              {dashboardData.users}
            </h2>
          </div>
        </div>
      </div>

      {/* SUBJECTS */}
      <div>
        <h3 className="text-2xl font-semibold mb-6">Subjects</h3>

        {!Array.isArray(subjects) || subjects.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No subjects added yet
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="bg-white rounded-2xl shadow p-8 h-40 flex items-center gap-6"
              >
                <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-[#006d5b]/10 text-[#006d5b]">
                  <FaBook size={30} />
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {subject.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
