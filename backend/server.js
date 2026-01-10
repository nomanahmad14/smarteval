import express from 'express';
import cors from 'cors'
import connectDB from './config/mongodb.js';
import 'dotenv/config'
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRouter.js';
import userRouter from './routes/userRouter.js';

const app=express()
const port=process.env.PORT || 4000;
connectDB()
connectCloudinary()

//MIDDLEWARES
app.use(express.json())
app.use(cors());

app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port,()=>{
    console.log("server started at port :",port)
})