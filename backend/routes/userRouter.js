import express from "express"
import { registerUser, loginUser, } from "../controllers/userController.js"
import upload from "../middlewares/multer.js";


const userRouter = express.Router();

userRouter.post('/register',upload.single("image"), registerUser)
userRouter.post('/login', loginUser)

export default userRouter