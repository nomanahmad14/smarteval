import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({

  attemptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",          
    required: true
  },

  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },

  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
      },
      selectedOption: {
        type: String,
        enum: ["a", "b", "c", "d"],
        required: true
      }
    }
  ],

  startedAt: {
    type: Date,
    default: Date.now
  },

  submittedAt: {
    type: Date
  },

  marksObtained: {
    type: Number,
    default: 0
  },

  isAutoSubmitted: {
    type: Boolean,
    default: false
  }
  

}, { timestamps: true });

const Attempt =
  mongoose.models.Attempt || mongoose.model("Attempt", attemptSchema);

export default Attempt;
