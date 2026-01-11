import express from 'express'
import { addSubject, addTeacher, loginAdmin } from '../controllers/adminController.js'
import authAdmin from '../middlewares/authAdmin.js' 

const adminRouter=express.Router()

adminRouter.post('/login',loginAdmin)
adminRouter.post('/addSubject', authAdmin, addSubject)
adminRouter.post("/addTeacher", authAdmin,addTeacher )

export default adminRouter