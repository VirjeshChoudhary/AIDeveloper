import 'dotenv/config.js';
// dotenv.config();
import app from './app.js';
import http from "http";
import { Server as SocketIoServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js'; 
import { generateResult } from './services/aiService.js';


const server=http.createServer(app);


// ...existing code...
const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map(s=>s.trim()).filter(Boolean);

const io = new SocketIoServer(server, {
    cors: {
        origin: function(origin, callback) {
            // allow non-browser requests (no origin)
            if (!origin) return callback(null, true);

            // allow configured origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, origin);
            }

            // during development allow any origin to help debugging
            if (process.env.NODE_ENV !== 'production') {
                return callback(null, origin);
            }

            return callback(new Error('Not allowed by CORS'));
        },
        methods: ["GET", "POST"],
        credentials: true,
    }
});
// ...existing code...
io.use(async(socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
        const projectId = socket.handshake.query.projectId;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }
        socket.project = await projectModel.findById(projectId);
        if (!token) {
            return next(new Error('Authentication error'))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new Error('Authentication error'))
        }
        socket.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
});
io.on('connection', (socket) => {
    socket.roomId= socket.project._id.toString();
    console.log('New client connected');

    socket.join(socket.roomId);//isse sirf isse project se conneect hoga saare user pr nahi jaayega
    socket.on('project-message',async data=>{
        const message = data.message;
        const aiIsPresent =message.includes('@ai');
        console.log('message received',data);
        if(aiIsPresent){
            const prompt = message.replace('@ai', '').trim();
            const aiResponse = await generateResult(prompt);
            socket.broadcast.to(socket.roomId).emit('project-message',data);
            io.to(socket.roomId).emit('project-message', {  // io isliye kyuki i want yeh message sab pr jaaye mujhe bhi wapas aaye
                message: aiResponse,
                sender: {
                    _id: 'ai',
                    email: 'AI'
                }
            });
            return;
        }
        socket.broadcast.to(socket.roomId).emit('project-message',data)
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        socket.leave(socket.roomId)
    });
});

const port=process.env.PORT;
server.listen(port,()=>{
    console.log(`server running at port ${port}`)
    // console.log(`http://localhost:${port}`);
})