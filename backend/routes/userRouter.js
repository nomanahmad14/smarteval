import express from "express";
import {
  loginUser, registerUser, getSubjectForUser, getQuizzesBySubjectForUser,
  startQuizAttempt, getAttemptDetails,
  submitQuizAttempt,autoSubmitQuizAttempt, getAttemptResult, getMyAttemptedQuizzes
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("image"), registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/subjects", authUser, getSubjectForUser);
userRouter.get("/subjects/:subjectId/quizzes", authUser, getQuizzesBySubjectForUser);

userRouter.post("/quiz/:quizId/start", authUser, startQuizAttempt);

userRouter.get("/attempt/:attemptId", authUser, getAttemptDetails);
userRouter.post("/attempt/:attemptId/submit", authUser, submitQuizAttempt);
userRouter.post("/attempt/:attemptId/auto-submit", authUser, autoSubmitQuizAttempt);

userRouter.get("/attempt/:attemptId/result", authUser, getAttemptResult);
userRouter.get("/attempts", authUser, getMyAttemptedQuizzes);

export default userRouter;
    