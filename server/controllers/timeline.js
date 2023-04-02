const mongoose = require('mongoose');
const TimelineModel = require('../models/timelineModel');
const userModel = require('../models/userModel');
const EventModel = require('../models/eventModel');
const cloudinary = require('cloudinary');

exports.createTimeline = async (req, res) => {
    try {
        const { name, description, tags } = req.body;
        console.log(name);
        const tagsArray = tags.split(',');
        console.log(req.body);
        const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale',
        });
        const timeline = await TimelineModel.create({
            name,
            description,
            tags: tagsArray,
            admin: req.user._id,
            photoUrl: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        });
        console.log(timeline);
        //insert this timeline id in users followedTimelines array
        const user = await userModel.findOneAndUpdate(
            { _id: req.user._id },
            {
                $addToSet: {
                    followedTimelines: {
                        timelineRef: timeline._id,
                    },
                },
            },
            { new: true, upsert: true }
        );

        res.status(201).json({
            success: true,
            timeline,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error creating timeline',
        });
    }
};
exports.getTimelineList = async (req, res) => {
    const keyword = req.params.keyword;
    console.log(keyword);
    try {
        //it shoulf find timelines matching the keyword and from the matching timeline, it should return name and photurl
        const timeline = await TimelineModel.find({
            name: { $regex: keyword, $options: 'i' },
        }).select('name photoUrl');
        console.log(timeline);
        res.status(200).json({
            success: true,
            timeline,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error finding Timeline List',
        });
    }
};

exports.getTimelineInfo = async (req, res) => {
    const timelineId = req.params.id;
    try {
        const userId = req.user._id;
        let timeline = await TimelineModel.findById(timelineId);
        if (!timeline) {
            throw new Error(`Timeline not found for id ${timelineId}`);
            return;
        }
        // now, from the user followedTimeline, check if it has this timeline in it
        const userdetails = await userModel.findById(userId);
        const followedTimeline = userdetails.followedTimelines;
        const isFollowed = followedTimeline.filter(
            (item) => item.timelineRef?.toString() === timelineId?.toString()
        );
        let flag = 0;
        if (isFollowed.length > 0) {
            flag = 1;
        } else {
            flag = 0;
        }

        res.status(200).json({
            success: true,
            timeline,
            flag,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error getting timeline info',
        });
    }
};

exports.followtimelinebyuser = async (req, res) => {
    const timelineid = req.params.id;

    try {
        const user = await userModel.findById(req.user._id);
        //check if already followed
        const isFollowed = user.followedTimelines.filter(
            (item) => item.timelineRef.toString() === timelineid.toString()
        );
        if (isFollowed.length > 0) {
            throw new Error('Already followed');
        }
        user.followedTimelines.push({ timelineRef: timelineid });
        await user.save();
        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Already followed',
        });
    }
};

exports.unfollowtimelinebyuser = async (req, res) => {
    const timelineid = req.params.id;
    try {
        const user = await userModel.findById(req.user._id);
        user.followedTimelines = user.followedTimelines.filter(
            (item) => item.timelineRef.toString() !== timelineid.toString()
        );
        await user.save();
        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error unfollowing timeline',
        });
    }
};

exports.listpersonalimp = async (req, res) => {
    try {
        //get list of timelines followed by user
        const user = await userModel.findById(req.user._id);
        const followedTimelines = user.followedTimelines;
        //create a list of timelines each having name and photoUrl
        const timelineList = [];
        for (let i = 0; i < followedTimelines.length; i++) {
            const timeline = await TimelineModel.findById(
                followedTimelines[i].timelineRef.toString()
            );
            timelineList.push({ ...timeline?._doc });
        }
        const myevents = await EventModel.find({
            createdBy: req.user._id,
            type: 'personal',
        });
        //for each event , also add the flag=0, if it is in impEvents array of user else 1
        for (let i = 0; i < myevents.length; i++) {
            const isImp = user.impEvents.filter(
                (item) => item.toString() === myevents[i]._id.toString()
            );
            if (isImp.length > 0) {
                myevents[i].flag = 0;
            } else {
                myevents[i].flag = 1;
            }
        }

        const impEvents = await userModel.findById(req.user._id);
        const impEventList = impEvents.impEvents;
        const eventList = [];
        for (let i = 0; i < impEventList.length; i++) {
            const event = await EventModel.findById(impEventList[i]);
            eventList.push({
                event,
            });
        }
        res.status(200).json({
            success: true,
            timelineList,
            myevents,
            eventList,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error getting personalimp',
        });
    }
};

exports.followtimelinefromtimeline = async (req, res) => {
    const { fromId, toId } = req.body;
    console.log(fromId, toId);
    try {
        const fromTimeline = await TimelineModel.findById(fromId);
        console.log(fromTimeline);
        const totimelineName = await TimelineModel.findById(toId);
        fromTimeline.followedTimeline.push({
            name: totimelineName.name,
            timelineId: toId,
        });
        await fromTimeline.save();
        let totimelineName1 = {
            name: totimelineName.name,
            timelineId: toId,
        };
        console.log(fromTimeline);
        res.status(200).json({
            success: true,
            fromTimeline,
            totimelineName1,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error following timeline',
        });
    }
};
exports.unfollowtimelinefromtimeline = async (req, res) => {
    const { fromId, toName } = req.body;
    try {
        const fromTimeline = await TimelineModel.findById(fromId);
        fromTimeline.followedTimeline = fromTimeline.followedTimeline.filter(
            (item) => item.name !== toName
        );
        console.log(fromTimeline);
        await fromTimeline.save();
        console.log(fromTimeline);
        res.status(200).json({
            success: true,
            fromTimeline,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error unfollowing timeline',
        });
    }
};

exports.gettagsoftimeline = async (req, res) => {
    const timelineid = req.params.id;
    try {
        let alltags = [];
        const timeline = await TimelineModel.findById(timelineid);
        for (let i = 0; i < timeline.followedTimeline.length; i++) {
            let inditags = {};
            const timelinechild = await TimelineModel.findById(
                timeline.followedTimeline[i].timelineId
            );
            inditags.name = timelinechild.name;
            inditags.id = timelinechild._id;
            //for each tag in timelinechild.tags, check whether it is present in timeline.uncheckedtags
            for (let j = 0; j < timelinechild.tags.length; j++) {
                const tag = timelinechild.tags[j]; //B1
                const isPresent = timeline.uncheckedTags.filter(
                    (item) => item === tag
                );
                if (isPresent.length > 0) {
                    inditags.tags.push({ name: tag, flag: 0 });
                } else {
                    inditags.tags.push({ name: tag, flag: 1 });
                }
            }
            for (let j = 0; j < timelinechild.followedTimeline.length; j++) {
                const timelinechild2 = await TimelineModel.findById(
                    timelinechild.followedTimeline[j]
                );
                //check if timelinechild2._id is present in timeline.unchild
                const isPresent = timeline.unchild.filter(
                    (item) => item === timelinechild2._id
                );
                if (isPresent.length > 0) {
                    inditags.child.push({
                        name: timelinechild2.name,
                        id: timelinechild2._id,
                        flag: 0,
                    });
                } else {
                    inditags.child.push({
                        name: timelinechild2.name,
                        id: timelinechild2._id,
                        flag: 1,
                    });
                }
            }
            alltags.push(inditags);
            res.status(200).json({
                success: true,
                alltags,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error getting tags',
        });
    }
};

exports.doneresponsesave = async (req, res) => {
    const alltags = req.body.alltags;
    const uncheckedtags = [];
    const uncheckedChildren = [];
    for (let i = 0; i < alltags.length; i++) {
        for (let j = 0; j < alltags[i].tags.length; j++) {
            if (alltags[i].tags[j].flag === 0) {
                uncheckedtags.push(alltags[i].tags[j].name);
            }
        }
        for (let j = 0; j < alltags[i].child.length; j++) {
            if (alltags[i].child[j].flag === 0) {
                uncheckedChildren.push(alltags[i].child[j].id);
            }
        }
    }
    try {
        const timeline = await TimelineModel.findById(req.params.id);
        timeline.uncheckedTags = uncheckedtags;
        timeline.uncheckedChildren = uncheckedChildren;
        await timeline.save();
        res.status(200).json({
            success: true,
            timeline,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error saving done response',
        });
    }
};
exports.deletetimeline = async (req, res) => {
    const id = req.params.id;
    try {
        console.log('The id is', id);
        const timeline = await TimelineModel.findById(id);
        console.log('The timeline is', timeline);
        if (timeline.admin.includes(req.user._id)) {
            const user = await userModel.findById(req.user._id).populate(
                'followedTimelines'
            );
            user.followedTimelines = user.followedTimelines.filter(
                (item) => item.timelineRef.toString() !== id.toString()
            );
            console.log(user);
            await user.save();
            await TimelineModel.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
            });
        } else {
            res.status(401).json({
                error: 'Unauthorized',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error deleting timeline',
        });
    }
};
