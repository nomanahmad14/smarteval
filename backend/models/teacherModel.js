import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    image: {
      type: String,
      default: "",
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },


    experience: {
      type: Number,
      required: true,
    },

    address: String,
    city: String,
    about: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

export default Teacher;
