import Teacher from "../models/teacherModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// api for teacher login

const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({ success:false, message:"Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ success:false, message:"Invalid credentials" });
    }

    const token = jwt.sign(
      { id: teacher._id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success:true, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success:false, message:"Server error" });
  }
};

export {loginTeacher}