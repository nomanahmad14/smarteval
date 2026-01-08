import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    subjects:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Subject"
        }
    ],
    subscribedTeachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }
  ]

},{ timestamps: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default userModel