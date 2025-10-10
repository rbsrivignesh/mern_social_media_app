import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';

import { getAllLoops, uploadLoop, comment, like } from '../controllers/loop_controller.js';


const loopRouter = express.Router();

loopRouter.post("/upload", isAuth, upload.single("media"), uploadLoop);
loopRouter.get("/get-all", isAuth, getAllLoops);

loopRouter.get("/like/:loopId", isAuth, like);
loopRouter.post("/comment/:loopId", isAuth, comment);

export default loopRouter