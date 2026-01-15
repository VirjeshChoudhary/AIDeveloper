import express from 'express';
import cookieParser from 'cookie-parser';
const app=express();
import dbConnection from "./db/db.js";
import morgan from "morgan";
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import cors from "cors";


// ...existing code...
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests like curl / server-to-server (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }

      // during local/dev (not production) allow the request to help debugging
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, origin);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// ...existing code...
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

dbConnection();

app.use('/users',userRoutes);
app.use('/projects',projectRoutes);
app.use('/ai',aiRoutes);
console.log("hihihihihihih");

app.get('/',(req,res)=>{
    res.json('hii');
});

console.log("hihi");

export default app;