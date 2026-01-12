import express from 'express'
import { loginTeacher } from '../controllers/teacherController.js';
import authTeacher from '../middlewares/authTeacher.js';


const teacherRouter=express.Router();

teacherRouter.post('/loginTeacher',loginTeacher)
teacherRouter.post('/addQuestion',authTeacher)

export default teacherRouter

