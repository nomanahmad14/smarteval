import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/userModel.js";
import Attempt from "../models/attemptModel.js"
import Subject from "../models/subjectModel.js"
import Question from '../models/questionModel.js'
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

const getSubjectForUser = async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true })

    res.json({
      success: true,
      subjects
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "server error" })
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

const startQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params
    const userId = req.user.id;

    const quiz = await Quiz.findOne({
      _id: quizId,
      isPublished: true,

    }).populate("questions")

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      })
    }

    const existingAttempt = await Attempt.findOne({
      attemptedBy: userId,
      quiz: quizId
    })

    if (existingAttempt && existingAttempt.submittedAt) {
      return res.status(403).json({
        success: false,
        message: "Quiz already attempted"
      });
    }

    if (!existingAttempt) {
      const attempt = await Attempt.create({
        attemptedBy: userId,
        quiz: quizId
      })

      return res.json({
        success: true,
        attemptId: attempt._id,
        duration: quiz.duration,
        questions: quiz.questions.map(q => ({
          _id: q._id,
          ques: q.ques,
          options: q.options
        }))
      })
    }

    res.json({
      success: true,
      attemptId: existingAttempt._id,
      duration: quiz.duration,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        ques: q.ques,
        options: q.options,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

const getAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user.id;

    const attempt = await Attempt.findOne({
      _id: attemptId,
      attemptedBy: userId,
    }).populate({
      path: "quiz",
      populate: {
        path: "questions",
        select: "ques options",
      },
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    if (attempt.submittedAt) {
      return res.status(403).json({
        success: false,
        message: "Quiz already submitted",
      });
    }

    res.json({
      success: true,
      attemptId: attempt._id,
      duration: attempt.quiz.duration,
      startedAt: attempt.startedAt,
      questions: attempt.quiz.questions,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const submitQuizAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;
    const { userId } = req.user.id;

    const attempt = await Attempt.findOne({
      _id: attemptId,
      attemptedBy: userId,
      submittedAt: { $exists: false },
    })

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt notfound oralready submiitted"
      });
    }

    let marks = 0;

    for (let ans of answers) {
      const question = await Question.findById(ans.question)
      if (question && question.correctAnswer === ans.selectedOption) {
        marks++;
      }
    }

    res.json({
      success: true,
      marksObtained: marks,
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


const autoSubmitQuizAttempt = async (req, res) => {
  try {
    req.body.isAuto = true;
    return submitQuizAttempt(req, res);
  } catch (error) {
    console.log(error)
  }

}
export {
  loginUser, registerUser, getSubjectForUser, getQuizzesBySubjectForUser,
  startQuizAttempt, getAttemptDetails,
  submitQuizAttempt,autoSubmitQuizAttempt
};

