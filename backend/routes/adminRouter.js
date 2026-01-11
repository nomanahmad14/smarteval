import express from 'express'
import { addSubject, addTeacher, loginAdmin } from '../controllers/adminController.js'
import authAdmin from '../middlewares/authAdmin.js' 
import upload from '../middlewares/multer.js'

const adminRouter=express.Router()

adminRouter.post('/login',loginAdmin)
adminRouter.post('/addSubject', authAdmin, addSubject)
adminRouter.post(
  "/addTeacher",
  
  upload.any(),
  authAdmin,
  addTeacher
);



export default adminRouter