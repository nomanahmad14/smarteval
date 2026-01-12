import express from 'express'
import authAdmin from '../middlewares/authAdmin';
import { loginTeacher } from '../controllers/teacherController.js';
import { addTeacher } from '../controllers/adminController.js';


const teacherRouter=express.Router();

teacherRouter.post("/addTeacher", authAdmin,addTeacher )

export default teacherRouter

