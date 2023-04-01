const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const TimelineModel = require('../models/timelineModel');

exports.googleSignUp = async (req, res) => {
    let { uid, email, displayName, photoUrl } = req.body;
    try {
        const oldUser = await UserModel.findOne({ email });
        if (oldUser) {
            const token = jwt.sign(
                { ...oldUser._doc },
                process.env.SECRET_KEY,
                {
                    expiresIn: '168h',
                }
            );
            res.status(200).json({
                success: 'true',
                result: { ...oldUser._doc, token },
                message: 'User already exists',
            });
        } else {
            const user = await UserModel.create({
                uid,
                displayName,
                photoUrl,
                email,
            });
            const token = jwt.sign({ ...user._doc }, process.env.SECRET_KEY, {
                expiresIn: '168h',
            });
            res.status(201).json({
                success: true,
                result: { ...user._doc, token },
                message: 'User created',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
        console.log(error);
    }
};

exports.followtimelinebyuser = async (req, res) => {
    const { timelineId } = req.body;
    try {
        const timelineRef = mongoose.Types.ObjectId(timelineId);

        const user = await UserModel.findOneAndUpdate(
            { _id: req.user._id },
            {
                $addToSet: {
                    followedTimelines: {
                        timelineRef,
                    },
                },
            },
            { new: true, upsert: true }
        );
        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error updating timeline',
        });
    }
};

exports.followFromTo = async (req, res) => {
    const { fromId, toId } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
        fromId,
        { $addToSet: { directFollow: toId } },
        { new: true }
    );

    res.json(updatedUser);
};

exports.getFollowingList = async (req, res) => {
    const { nodeId } = req.body;
    const user = await UserModel.findById(nodeId);
    if (!user) {
        throw new Error(`User not found for id ${nodeId}`);
    }

    const friendsBelow = [];

    async function traverseFriends(userId) {
        const user = await UserModel.findById(userId).populate('directFollow');
        if (!user) {
            return;
        }

        for (const friend of user.directFollow) {
            if (!friendsBelow.includes(friend.id)) {
                friendsBelow.push(friend.id);
                await traverseFriends(friend.id);
            }
        }
    }

    await traverseFriends(user.id);

    res.json(friendsBelow);
};

exports.gettimelinetags = async (req, res) => {
    const timelineId = req.params.id;
    try {
        //find immediate children
        const timeline = await TimelineModel.findById(timelineId);
        const tags = [];
        for (let i = 0; i < timeline.followedTimelines.length; i++) {
            let inditag = {};
            const eachtimeline = await TimelineModel.findById(
                timeline.followedTimelines[i]
            );
            inditag.timelineId = eachtimeline._id;
            inditag.name = eachtimeline.name;
            inditag.tags = eachtimeline.tags;
            //get immediate children of eachtimeline
        }
        res.status(200).json({
            success: true,
            tags,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error getting timeline tags',
        });
    }
};
