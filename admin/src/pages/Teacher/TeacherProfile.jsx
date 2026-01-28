import { useContext, useEffect, useState } from "react";
import { TeacherContext } from "../../context/TeacherContext";
import { toast } from "react-toastify";

const DEFAULT_IMAGE =
  "https://via.placeholder.com/120?text=Teacher";

const TeacherProfile = () => {
  const {
    getTeacherProfile,
    updateTeacherProfile,
    loading,
  } = useContext(TeacherContext);

  const [editMode, setEditMode] = useState(false);
  const [teacher, setTeacher] = useState(null);

  const [form, setForm] = useState({
    name: "",
    experience: "",
    about: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await getTeacherProfile();
      if (res.success) {
        setTeacher(res.teacher);
        setForm({
          name: res.teacher.name || "",
          experience: res.teacher.experience || "",
          about: res.teacher.about || "",
        });
      } else {
        toast.error(res.message || "Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!form.name || form.experience === "") {
      return toast.error("Name and experience are required");
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("experience", form.experience);
    formData.append("about", form.about);
    if (image) formData.append("image", image);

    const res = await updateTeacherProfile(formData);

    if (res.success) {
      toast.success(res.message);
      setTeacher({ ...teacher, ...form });
      setEditMode(false);
      setImage(null);
    } else {
      toast.error(res.message);
    }
  };

  if (!teacher) return null;

  return (
    <div className="px-6 md:px-10 py-6 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Profile
          </h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#006d5b] text-white px-6 py-2 rounded-lg"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#006d5b] text-white px-6 py-2 rounded-lg"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-6">
          <label className={editMode ? "cursor-pointer" : ""}>
            <img
              src={preview || teacher.image || DEFAULT_IMAGE}
              className="w-28 h-28 rounded-full object-cover border bg-gray-100"
            />
            {editMode && (
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
          </label>

          <div className="text-sm text-gray-500">
            Profile Picture
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editMode}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Experience (years)
            </label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              disabled={!editMode}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              About
            </label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              disabled={!editMode}
              rows={4}
              className="input resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
