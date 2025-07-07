import express from 'express';
import cookieParser from 'cookie-parser';
const app=express();
import dbConnection from "./db/db.js"
import morgan from "morgan";
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import cors from "cors";


const allowedOrigins = process.env.CLIENT_URL.split(',');

app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin (like mobile apps, curl, etc.)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) !== -1){
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
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