import express from 'express';
import cookieParser from 'cookie-parser';
const app=express();
import dbConnection from "./db/db.js"
import morgan from "morgan";
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import cors from "cors";


app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

dbConnection();

app.use('/users',userRoutes);
app.use('/projects',projectRoutes);
app.use('/ai',aiRoutes);

app.get('/',(req,res)=>{
    res.json('hii');
})

export default app;