import mongoose from "mongoose";

const questionSchema=new mongoose.Schema({
    ques:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"]
    },
    options: {
  a: {
    type: String,
    required: true
  },
  b: {
    type: String,
    required: true
  },
  c: {
    type: String,
    required: true
  },
  d: {
    type: String,
    required: true
  }
},

correctAnswer: {
  type: String,
  enum: ["a", "b", "c", "d"],
  required: true
},
createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher",
    required:true
},
subject:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Subject",
    required:true
}

},{timestamps:true})

const Question=mongoose.models.Question ||  mongoose.model("Question", questionSchema);
export default Question