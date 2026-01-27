import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const AddTeacher = () => {
  const { addTeacher, subjects, fetchSubjects, loading } =
    useContext(AdminContext);

  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    subject: "",
    experience: "",
    address: "",
    city: "",
    about: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );

    if (image) {
      formData.append("image", image);
    }

    const res = await addTeacher(formData);

    if (res.success) {
      toast.success(res.message);
      setForm({
        name: "",
        email: "",
        password: "",
        subject: "",
        experience: "",
        address: "",
        city: "",
        about: "",
      });
      setImage(null);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="px-6 md:px-10 py-6 max-w-5xl">
      <div className="bg-white rounded-2xl shadow-sm p-8">

        {/* PROFILE IMAGE */}
        <div className="flex items-center gap-6 mb-10">
          <label
            htmlFor="teacher-img"
            className="cursor-pointer"
          >
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : "https://via.placeholder.com/96?text=Upload"
              }
              alt="teacher"
              className="w-24 h-24 rounded-full object-cover border bg-gray-100"
            />
          </label>
          <input
            type="file"
            id="teacher-img"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div>
            <p className="font-medium text-gray-800">
              Upload Profile Picture
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG (optional)
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="input"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 8 chars)"
            value={form.password}
            onChange={handleChange}
            className="input"
          />

          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            value={form.experience}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="input md:col-span-2"
          />

          <textarea
            name="about"
            placeholder="About Teacher"
            value={form.about}
            onChange={handleChange}
            rows={4}
            className="input md:col-span-2 resize-none"
          />

          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              disabled={loading}
              className="bg-[#006d5b] text-white px-10 py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              {loading ? "Adding..." : "Add Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;
