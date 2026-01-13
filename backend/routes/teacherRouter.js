import express from 'express'
import { addQuestion, loginTeacher ,addQuestionsToQuiz, removeQuestionFromQuiz,
  publishQuiz,
  createQuiz,
  getQuestionsBySubject,
  getQuizById} from '../controllers/teacherController.js';
import authTeacher from '../middlewares/authTeacher.js';


const teacherRouter=express.Router();

teacherRouter.post('/loginTeacher',loginTeacher)
teacherRouter.post('/addQuestion',authTeacher,addQuestion)
teacherRouter.post('/quiz/create',authTeacher,createQuiz)
teacherRouter.get('/questions',authTeacher,getQuestionsBySubject)
teacherRouter.post('/quiz/:quizId/addQuestions',authTeacher,addQuestionsToQuiz)
teacherRouter.get('/quiz/:quizId',authTeacher,getQuizById)
teacherRouter.delete('/quiz/:quizId/removeQuestion/:questionId',authTeacher,removeQuestionFromQuiz)
teacherRouter.post('/quiz/:quizId/publish',authTeacher,publishQuiz)


export default teacherRouter

