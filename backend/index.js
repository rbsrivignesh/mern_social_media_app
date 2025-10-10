import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth_routes.js';
import userRouter from './routes/user_routes.js';
import postRouter from './routes/post_routes.js';
import loopRouter from './routes/loop_routes.js';
import storyRouter from './routes/story_routes.js';
import messageRouter from './routes/message_routes.js';
import { app, server } from './socket.js';

dotenv.config()

const port = process.env.PORT || 8001;
console.log(process.env.CLIENT_URL)
app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}))
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/loop",loopRouter);
app.use("/api/story",storyRouter)
app.use("/api/message",messageRouter)


connectDB();

app.get("/",(req,res)=>{res.send("Api is working!")})

server.listen(port, () => { console.log(`Server running on Port : ${port}`) })
