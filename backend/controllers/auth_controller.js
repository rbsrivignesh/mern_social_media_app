import sendMail from "../config/mail.js";
import genToken from "../config/token.js";
import User from "../models/user_model.js";
import bcrypt from 'bcryptjs'
export const signUp = async (req, res) => {
    try {
        const { name, email, password, userName } = req.body;
        if (!name || !email || !password || !userName) {

            return res.status(400).json({ message: "All Fields are mandatory" });
        }



        const findByEmail = await User.findOne({ email });

        if (findByEmail) {
            return res.status(400).json({ message: "Email Already Exists!!" });
        }
        const findByUserName = await User.findOne({ userName });
        if (findByUserName) {
            return res.status(400).json({ message: "Username Already Exists!!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be minimun 6 characters!!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            userName,
            email,
            password: hashedPassword
        });

        const token = await genToken(user._id);

        res.cookie("token", token, {
            secure: false,
            sameSite: "Strict",
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            domain: "rb-social.onrender.com"

        })

        return res.status(201).json(user);






    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Sign Up Error ${error}` });
    }
}
export const signIn = async (req, res) => {
    try {
        const { password, userName } = req.body;
        if (!password || !userName) {

            return res.status(400).json({ message: "All Fields are mandatory" });
        }


        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "Username not Found!!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials!!" });
        }


        const token = await genToken(user._id);

        res.cookie("token", token, {
            secure: false,
            sameSite: "Strict",
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            domain: "rb-social.onrender.com"

        })

        return res.status(200).json(user);






    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Sign In Error ${error}` });
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            secure: false,
            sameSite: "Strict",
            httpOnly: true,
            path: "/"   // include this for safety
        });

        return res.status(200).json({ message: "Sign out is successful" })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Sign Out Error ${error}` });
    }
}

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User Not Found!!" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;
        await user.save();
        
        return res.status(200).json({ emails:email, otp });

        //    return res.status(200).json({message : "Otp sent successfully!!"})


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Send Otp Error ${error}` });
    }
}


export const trialOtp = async (req, res) => {
    try {

        const { emails, otp } = req.body;
        console.log({ emails, otp } )
      
           await sendMail(emails,otp)
        return res.status(200).json({ message: "Otp sent successfully!!" })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Send Otp Error ${error}` });
    }
}
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        let user = await User.findOne({ email });
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid / Expired OTP!!" });
        }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({ message: "Otp verified successfully!!" })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Verify Otp Error ${error}` });
    }
}


export const resetPassword = async (req, res) => {

    try {
        const { email, newPassword } = req.body;
        let user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "OTP Verification required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be minimun 6 characters!!" });
        }



        console.log(newPassword)
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();


        return res.status(200).json({ message: "Password reset successfully!!" })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Password reset Error ${error}` });
    }
}
