import Teacher from "../models/teacherModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Question from "../models/questionModel.js";
import Quiz from "../models/quizModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// api for teacher login

const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email }).select("+password");
    if (!teacher) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: teacher._id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
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

const createQuiz = async (req, res) => {
  try {
    const { title, subjectId, duration } = req.body;
    const teacherId = req.user.id;

    if (!title || !subjectId || !duration) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const quiz = await Quiz.create({
      title,
      teacherId,
      subjectId,
      duration,
      questions: [],
    });

    res.status(201).json({
      success: true,
      quizId: quiz._id,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getQuestionsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.query;
    const teacherId = req.user.id;

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID required",
      });
    }

    const questions = await Question.find({
      subject: subjectId,
      createdBy: teacherId,
    });

    res.json({
      success: true,
      questions,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const teacherId = req.user.id;

    const quiz = await Quiz.findOne({
      _id: quizId,
      teacherId,
    }).populate("questions");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.json({
      success: true,
      quiz,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const addQuestionsToQuiz = async (req, res) => {

  try {
    const { quizId } = req.params;
    const { questionIds } = req.body;
    const teacherId = req.user.id;

    if (!Array.isArray(questionIds) || questionIds.length === 0 ) {
      return res.status(400).json({
        success: false,
        message: "QuestionIds required",
      })
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      teacherId,
      isPublished: false,
    })

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found or already published",
      });
    }

    quiz.questions = [
      ...new Set([
        ...quiz.questions.map(id => id.toString()),
        ...questionIds,
      ]),
    ];

    await quiz.save();

    res.json({
      success: true,
      totalQuestions: quiz.questions.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const removeQuestionFromQuiz=async(req,res)=>{
  try {

    const { quizId, questionId } = req.params;
    const teacherId = req.user.id;

    const quiz = await Quiz.findOne({
      _id: quizId,
      teacherId,
      isPublished: false,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found or already published",
      });
    }

    quiz.questions=quiz.questions.filter(
      id => id.toString() !== questionId
    )

    await quiz.save()

    res.json({
      success: true,
      totalQuestions: quiz.questions.length,
    });
  }catch (error){
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

const publishQuiz=async(req,res)=>{
  try{
    const { quizId } = req.params;
    const teacherId = req.user.id;

    const quiz = await Quiz.findOne({
      _id: quizId,
      teacherId,
      isPublished: false,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found or already published",
      });
    }


    if (quiz.questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz must contain at least one question",
      });
    }

    quiz.isPublished = true;
    quiz.totalMarks = quiz.questions.length;

    await quiz.save();

    res.json({
      success: true,
      message: "Quiz published successfully",
    });
  }catch (error)
  {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}




const updateTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { name, experience, about } = req.body;

    if (!name || experience === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name and experience are required",
      });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const updateData = {
      name,
      experience: Number(experience),
      about,
    };

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      updateData.image = uploadResult.secure_url;
      fs.unlinkSync(req.file.path); 
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Teacher profile updated successfully",
      teacher: updatedTeacher,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getTeacherProfile = async (req, res) => {
  const teacher = await Teacher.findById(req.user.id).select("-password");
  res.json({ success: true, teacher });
};

const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const quizzes = await Quiz.find({ teacherId })
      .select("title isPublished duration totalMarks createdAt")
      .sort({ createdAt: -1 });

    const totalQuizzes = quizzes.length;
    const publishedQuizzes = quizzes.filter(q => q.isPublished).length;
    const unpublishedQuizzes = quizzes.filter(q => !q.isPublished).length;

    res.json({
      success: true,
      dashboard: {
        totalQuizzes,
        publishedQuizzes,
        unpublishedQuizzes,
        quizzes,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export { 
  loginTeacher, addQuestion , createQuiz, getQuestionsBySubject, getQuizById,
  addQuestionsToQuiz, removeQuestionFromQuiz,
  publishQuiz, updateTeacherProfile,getTeacherProfile,
  getTeacherDashboard
}