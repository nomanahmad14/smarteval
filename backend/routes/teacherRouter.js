import express from 'express'
import { addQuestion, loginTeacher } from '../controllers/teacherController.js';
import authTeacher from '../middlewares/authTeacher.js';


const teacherRouter=express.Router();

teacherRouter.post('/loginTeacher',loginTeacher)
teacherRouter.post('/addQuestion',authTeacher,addQuestion)

export default teacherRouter

