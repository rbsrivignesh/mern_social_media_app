import express from 'express'
import { editProfile, follow, followingList, getAllNotifications, getCurrentUser, getProfile, markAsRead, search, suggestedUsers } from '../controllers/user_controller.js';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';


const userRouter = express.Router();

userRouter.get("/current",isAuth, getCurrentUser)
userRouter.get("/search",isAuth, search)
userRouter.get("/following-list",isAuth, followingList)
userRouter.get("/suggested",isAuth, suggestedUsers)
userRouter.get("/get-profile/:userName",isAuth, getProfile)
userRouter.get("/follow/:targetUserId",isAuth, follow) 
userRouter.get("/get-notifications",isAuth, getAllNotifications) 
userRouter.post("/mark-as-read",isAuth, markAsRead) 
userRouter.post("/edit-profile",isAuth,upload.single("profileImage"),editProfile)


export default userRouter;