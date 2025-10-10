import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification_model.js";
import User from "../models/user_model.js";
import { getSocketId, io } from "../socket.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("posts loops story following followers");
        if (!user) {
            return res.status(400).json({ message: "User Not Found" })
        }
        await user.populate("saved");
        await user.populate("saved.author", "name userName profileImage");
        await user.populate("saved.comments.author", "name userName profileImage");

        return res.status(200).json(user);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `get current user Error ${error}` });
    }
}

export const suggestedUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.userId }
        });
        return res.status(200).json(users);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `get suggested user Error ${error}` });
    }
}


export const editProfile = async (req, res) => {
    try {
        const { name, userName, bio, profession, gender } = req.body;
        let user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User Not Found" })
        }

        const sameUserWithUserName = await User.findOne({ userName }).select("-password");
        if (sameUserWithUserName && sameUserWithUserName._id != req.userId) {
            return res.status(400).json({ message: "Username already exists!!!!" })
        }

        let profileImage;
        if (req.file) {
            console.log(req.file.path)
            profileImage = await uploadOnCloudinary(req.file.path);
            user.profileImage = profileImage;
        }

        user.name = name;
        user.userName = userName;
        user.profession = profession;
        user.bio = bio;
        user.gender = gender;

        await user.save();

        return res.status(200).json(user);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `edit user profile Error ${error}` });
    }
}

export const getProfile = async (req, res) => {
    try {
        const userName = req.params.userName;
        const user = await User.findOne({ userName }).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User Not found!!!" })
        }

        await user.populate("followers");
        await user.populate("following");
        await user.populate("story posts loops")
        return res.status(200).json(user);


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `get Profile Error ${error}` });
    }
}

export const follow = async (req, res) => {
    try {

        const currentUserId = req.userId;
        const targetUserId = req.params.targetUserId;

        if (!targetUserId) {
            return res.status(400).json({ message: "Target used Id is not found" })
        }
        if (!currentUserId) {
            return res.status(400).json({ message: "current used Id is not found" })
        }

        if (currentUserId == targetUserId) {
            return res.status(400).json({ message: "cannot follow yourself" })
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        const isFollowing = currentUser.following.includes(targetUserId);
        if (isFollowing) {
            currentUser.following = currentUser.following.filter(id => id.toString() != targetUserId.toString());
            targetUser.followers = targetUser.followers.filter(id => id.toString() != currentUserId.toString());
            await currentUser.save();
            await targetUser.save();

            return res.status(200).json({
                following: false,
                message: "Unfollow Successfully"
            })


        }
        else {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);

            if (targetUser._id != req.userId) {
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: targetUser._id,
                    type: "follow",

                    message: "Started Following You!"
                });

                const populateNotification = await Notification.findById(notification._id).populate("receiver sender");
                const receiverSocketId = getSocketId(targetUser._id);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populateNotification);
                }
            }

            await currentUser.save();
            await targetUser.save();

            return res.status(200).json({
                following: true,
                message: "follow Successfully"
            })


        }




    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `follow  Error ${error}` });
    }
}

export const followingList = async (req, res) => {
    try {
        const result = await User.findById(req.userId).populate("following");
        return res.status(200).json(result?.following);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `get follow list  Error ${error}` });
    }
}


export const search = async (req, res) => {
    try {
        const keyWord = req.query.keyword;
        if (!keyWord) {
            return res.status(400).json({ message: "Key word is required" });
        }

        const user = await User.find({

            $or: [
                { userName: { $regex: keyWord, $options: "i" } },
                { name: { $regex: keyWord, $options: "i" } }
            ]

        }).select("-password");

        return res.status(200).json(user)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: `find users  Error ${error}` });
    }
}

export const getAllNotifications = async (req, res) => {
    try {
        const notification = await Notification.find({
            receiver: req.userId
        }).sort({ createdAt: -1 }).populate("sender receiver post loop");

        return res.status(200).json(notification);
    }

    catch (error) {
        console.log(error)
        return res.status(500).json({ message: `get notification  Error ${error}` });
    }
}

export const markAsRead = async (req, res) => {
    try {

        const {notificationId} = req.body;
       

        if (Array.isArray(notificationId)) {
            await Notification.updateMany({
                _id: {
                    $in: notificationId
                },
                receiver: req.userId
            },
                {
                    $set : {isRead : true}

                })
        }
        else{
            await Notification.findOneAndUpdate(
                { _id : notificationId, receiver : req.userId},
                {$set : {isRead : true}}
            )
        }
       
        return res.status(200).json({ message: "Marked As Read" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `read notification  Error ${error}` });
    }
}