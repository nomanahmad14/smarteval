import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import Teacher from "../models/teacherModel.js";
import validator from 'validator'
import Subject from "../models/subjectModel.js";


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//api for adding teacher

const addTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      subject,
      experience,
      address,
      city,
      about,
    } = req.body;

    // 1️⃣ Required field check
    if (
      !name ||
      !email ||
      !password ||
      !subject ||
      !experience ||
      !address ||
      !city ||
      !about
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    // 2️⃣ Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    // 3️⃣ Password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // 4️⃣ Check duplicate teacher
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(409).json({
        success: false,
        message: "Teacher already exists",
      });
    }

    // 5️⃣ Validate subject
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject",
      });
    }

    // 6️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7️⃣ OPTIONAL image upload
    let imageUrl = "";
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    }

    // 8️⃣ Create teacher
    const teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl, // empty string if no image
      subject,
      experience,
      address,
      city,
      about,
    });

    if (teacher) {
      res.json({
        success: true,
        message: "Teacher created successfully",
        teacherId: teacher._id,
      });
    }



  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//add subject 
const addSubject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    const existingSubject = await Subject.findOne({ name });
    if (existingSubject) {
      return res.status(409).json({
        success: false,
        message: "Subject already exists",
      });
    }

    const subject = await Subject.create({ name });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subjectId: subject._id,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export { loginAdmin, addTeacher,addSubject};
