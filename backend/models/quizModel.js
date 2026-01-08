import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },

  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },

  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true
  }],

  duration: {
    type: Number, 
    required: true
  },

  totalMarks: {
    type: Number,
    required: true
  },



}, { timestamps: true });

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;
