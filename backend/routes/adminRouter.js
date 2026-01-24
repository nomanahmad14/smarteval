import express from 'express'
import { addSubject, addTeacher, loginAdmin ,allTeachers, adminDashboard, allSubjects} from '../controllers/adminController.js'
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
adminRouter.post('/allTeachers',authAdmin,allTeachers)
adminRouter.post('/dashData',authAdmin,adminDashboard)
adminRouter.get("/allSubjects", authAdmin, allSubjects);



export default adminRouter