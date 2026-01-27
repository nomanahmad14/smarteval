import { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const AddSubject = () => {
  const { addSubject, loading } = useContext(AdminContext);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Subject name is required");
    }

    const res = await addSubject(name.trim());

    if (res.success) {
      toast.success(res.message);
      setName("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="px-6 md:px-10 py-6 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add Subject
          </h2>
          <p className="text-gray-500 mt-1">
            Create a new subject for teachers
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#006d5b] text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              {loading ? "Adding..." : "Add Subject"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddSubject;
