import express from 'express'
import { addQuestion, loginTeacher ,addQuestionsToQuiz, removeQuestionFromQuiz,
  publishQuiz,
  createQuiz,
  getQuestionsBySubject,
  getQuizById, updateTeacherProfile,
  getTeacherProfile,getTeacherDashboard} from '../controllers/teacherController.js';
import authTeacher from '../middlewares/authTeacher.js';
import upload from "../middlewares/multer.js";

const teacherRouter=express.Router();

teacherRouter.post('/loginTeacher',loginTeacher)
teacherRouter.post('/addQuestion',authTeacher,addQuestion)
teacherRouter.post('/quiz/create',authTeacher,createQuiz)
teacherRouter.get('/questions',authTeacher,getQuestionsBySubject)
teacherRouter.post('/quiz/:quizId/addQuestions',authTeacher,addQuestionsToQuiz)
teacherRouter.get('/quiz/:quizId',authTeacher,getQuizById)
teacherRouter.delete('/quiz/:quizId/removeQuestion/:questionId',authTeacher,removeQuestionFromQuiz)
teacherRouter.post('/quiz/:quizId/publish',authTeacher,publishQuiz)
teacherRouter.put( "/profile/update", authTeacher,upload.single("image"),updateTeacherProfile);
teacherRouter.get('/profile',authTeacher,getTeacherProfile)
teacherRouter.get('/dashboard',authTeacher,getTeacherDashboard);


export default teacherRouter

