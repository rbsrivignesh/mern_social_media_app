import express from 'express'
import { resetPassword, sendOtp, signIn, signOut, signUp, trialOtp, verifyOtp } from '../controllers/auth_controller.js';
const authRouter = express.Router();

authRouter.post("/sign-up", signUp)
authRouter.post("/sign-in", signIn)
authRouter.get("/sign-out", signOut)
authRouter.post("/send-otp", sendOtp)
authRouter.post("/trial-otp", trialOtp)
authRouter.post("/verify-otp", verifyOtp)
authRouter.post("/reset-password", resetPassword)

export default authRouter; 