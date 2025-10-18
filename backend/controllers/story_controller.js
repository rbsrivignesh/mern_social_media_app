import uploadOnCloudinary from "../config/cloudinary.js";
import Story from "../models/story_model.js"
import User from "../models/user_model.js"

export const uploadStory = async (req, res) => {
    try {
        let user = await User.findById(req.userId)
        if (user.story) {
            await Story.findByIdAndDelete(user.story);
            user.story = null;
        }

        const { mediaType } = req.body;
        let media;
        if (req.file) {
            media = await uploadOnCloudinary(req.file.path);
        } else {
            return res.status(400).json({ message: "media is required" })
        }

        const story = await Story.create({
            author: req.userId,
            media, mediaType
        });

        user.story = story._id;
        await user.save();

        const populatedStory = await Story.findById(story._id)
            .populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage");

        return res.status(201).json(populatedStory);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `upload Story Error ${error}` });
    }
}

export const viewStory = async (req, res) => {
    try {
        const storyId = req.params.storyId;
        let story = await Story.findById(storyId);
        if (!story) {
            return res.status(400).json({ message: "Story not found!!!" })
        }

        let viewersId = story.viewers.map(id => id.toString());

        if (!viewersId.includes(req.userId.toString())) {
            story.viewers.push(req.userId);
            await story.save();
        }
        const populatedStory = await Story.findById(story._id)
            .populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage");

        return res.status(200).json(populatedStory);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `View Story Error ${error}` });
    }
}

export const getStoryByUserName = async (req, res) => {
    try {
        const userName = req.params.userName;
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "User not Found!!!" });

        }

        const story = await Story.find({
            author: user._id
        }).populate("author viewers");
        return res.status(200).json(story);


    } catch (error) {
        return res.status(500).json({ message: `Get User Story Error ${error}` });
    }
}

export const getAllStories = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId);
        const followingIds = currentUser?.following;

        const stories = await Story.find({
            author: { $in: followingIds }
        }).populate("viewers author").sort({ createdAt: -1 });


        // await stories.populate("viewers author");

        return res.status(200).json(stories);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Get all Story Error ${error}` });
    }
}