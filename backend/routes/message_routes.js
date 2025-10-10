import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';


import { getAllMessages, getPrevUserChats, sendMessage } from '../controllers/message_controller.js';


const messageRouter = express.Router();

messageRouter.post("/send/:receiverId",isAuth,upload.single("image"),sendMessage);


messageRouter.get("/get-all/:receiverId",isAuth,getAllMessages);
messageRouter.get("/prev-chats",isAuth,getPrevUserChats);

export default messageRouter