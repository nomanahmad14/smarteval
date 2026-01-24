import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

export const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    const { authAxios } = useAuth();

    const [dashboardData, setDashboardData] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);


    const fetchSubjects = async () => {
        try {
            const { data } = await authAxios.get("/api/admin/allSubjects");
            if (data.success) {
                setSubjects(data.subjects);
            }
        } catch (error) {
            console.error(error);
        }
    };



    // DASHBOARD DATA


    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const { data } = await authAxios.post("/api/admin/dashData");

            if (data.success) {
                setDashboardData(data.dashData);
            }
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };


    // GET ALL TEACHERS

    const fetchAllTeachers = async () => {
        try {
            setLoading(true);
            const { data } = await authAxios.post("/api/admin/allTeachers");

            if (data.success) {
                setTeachers(data.teachers);
            }
        } catch (error) {
            console.error("Fetch teachers error:", error);
        } finally {
            setLoading(false);
        }
    };


    // ADD SUBJECT

    const addSubject = async (name) => {
        try {
            const { data } = await authAxios.post("/api/admin/addSubject", { name });
            return data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Error adding subject",
            };
        }
    };


    // ADD TEACHER

    const addTeacher = async (formData) => {
        try {
            const { data } = await authAxios.post(
                "/api/admin/addTeacher",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Error adding teacher",
            };
        }
    };

    return (
        <AdminContext.Provider
            value={{
                dashboardData,
                teachers,
                subjects,
                loading,
                fetchDashboardData,
                fetchAllTeachers,
                addSubject,
                addTeacher,
                fetchSubjects
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export default AdminProvider;
