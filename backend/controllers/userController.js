import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/userModel.js";
import Attempt from "../models/attemptModel.js"
import Subject from "../models/subjectModel.js"
import fs from "fs";


const registerUser = async (req, res) => {
  try {

    console.log(req.body);
    console.log(req.file);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = "";

    const imageFile = req.files?.find(
      (file) => file.fieldname === "image"
    );

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadRes.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl
    });

    const token = jwt.sign(
      { id: user._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: "student",
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

const getSubjectForUser=async (req,res)=>{
  try{
    const subjects=await Subject.find({isActive:true})

    res.json({
      success:true,
      subjects
    })
  }catch(error){
    console.log(error)
    res.status(500).json({success:false,message:"server error"})
  }
}

const getQuizzesBySubjectForUser = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;

    const quizzes = await Quiz.find({
      subjectId,
      isPublished: true,
    });

    const attempts = await Attempt.find({
      attemptedBy: userId,
    }).select("quiz");

    const attemptedQuizIds = attempts.map(a => a.quiz.toString());

    const attemptedQuizzes = [];
    const newQuizzes = [];

    quizzes.forEach(quiz => {
      if (attemptedQuizIds.includes(quiz._id.toString())) {
        attemptedQuizzes.push(quiz);
      } else {
        newQuizzes.push(quiz);
      }
    });

    res.json({
      success: true,
      attemptedQuizzes,
      newQuizzes,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export { loginUser, registerUser,getSubjectForUser, getQuizzesBySubjectForUser };

