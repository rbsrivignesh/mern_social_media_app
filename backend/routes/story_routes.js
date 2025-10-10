import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';

import { getAllStories, getStoryByUserName, uploadStory, viewStory } from '../controllers/story_controller.js';


const storyRouter = express.Router();

storyRouter.post("/upload",isAuth,upload.single("media"),uploadStory);

storyRouter.get("/view/:storyId",isAuth,viewStory);
storyRouter.get("/get-all",isAuth,getAllStories);
storyRouter.get("/get-by-username/:userName",isAuth,getStoryByUserName);

export default storyRouter