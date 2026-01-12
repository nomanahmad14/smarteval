import Teacher from "../models/teacherModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Question from "../models/questionModel.js";

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



const addQuestion = async (req, res) => {
  try {
    const {
      ques,
      difficulty,
      options,
      correctAnswer,
      subject
    } = req.body;

    const teacherId = req.user.id;

    if (!ques || !options || !correctAnswer || !subject) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!options?.a || !options?.b || !options?.c || !options?.d) {
      return res.status(400).json({
        success: false,
        message: "All four options (a, b, c, d) are required",
      });
    }

    if (!["a", "b", "c", "d"].includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must be one of a, b, c, or d",
      });
    }

    if (difficulty && !["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty",
      });
    }

    const question = await Question.create({
      ques,
      difficulty,
      options,
      correctAnswer,
      subject,
      createdBy: teacherId,
    });

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      questionId: question._id,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export {loginTeacher, addQuestion}