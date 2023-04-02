const mongoose = require('mongoose');
const EventModel = require('../models/eventModel');
const TimelineModel = require('../models/timelineModel');
const userModel = require('../models/userModel');
const cloudinary = require('cloudinary');
const timelineModel = require('../models/timelineModel');

exports.createmyEvent = async (req, res) => {
    try {
        const { tags } = req.body;
        console.log(req.body);
        const tagsArray = tags.split(',');
        // const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        //     folder: 'avatars',
        //     width: 150,
        //     crop: 'scale',
        // });
        const event = await EventModel.create({
            ...req.body,
            tags: tagsArray,
            createdBy: req.user._id,
            // photoUrl: {
            //     public_id: myCloud.public_id,
            //     url: myCloud.secure_url,
            // },
        });
        res.status(201).json({
            success: true,
            event,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error creating event',
        });
    }
};

exports.deletemyEvent = async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id);
        if (event.createdBy.toString() !== req.user._id.toString()) {
            throw new Error('Unauthorized');
        }
        await EventModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            event,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error deleting event',
        });
    }
};
exports.editmyEvent = async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id);
        if (event.createdBy.toString() !== req.user._id.toString()) {
            throw new Error('Unauthorized');
        }
        Object.keys(req.body).forEach((key) => {
            event[key] = req.body[key];
        });
        await event.save();

        res.status(200).json({
            success: true,
            event,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error editing event',
        });
    }
};
exports.getmyEvents = async (req, res) => {
    try {
        const events = await EventModel.find({ createdBy: req.user._id });
        res.status(200).json({
            success: true,
            events,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error getting events',
        });
    }
};

exports.getEventdetailsById = async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id);
        res.status(200).json({
            success: true,
            event,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error getting event details',
        });
    }
};

exports.createEventfortimeline = async (req, res) => {
    try {
        //check firts req.user._id is admin of timeline or not
        const timeline = await TimelineModel.findById(req.params.id);
        if (timeline.admin.toString() !== req.user._id.toString()) {
            throw new Error('Unauthorized');
        }
        // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        //     folder: 'avatars',
        //     width: 150,
        //     crop: 'scale',
        // });
        const event = await EventModel.create({
            ...req.body,
            createdBy: req.user._id,
            type: 'timeline',
            // photoUrl: {
            //     public_id: myCloud.public_id,
            //     url: myCloud.secure_url,
            // },
        });
        timeline.events.push(event._id);
        await timeline.save();
        res.status(201).json({
            success: true,
            event,
            timeline,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error creating event',
        });
    }
};
exports.editEventfortimeline = async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id);
        if (event.createdBy.toString() !== req.user._id.toString()) {
            throw new Error('Unauthorized');
        }
        console.log(req.body);
        Object.keys(req.body).forEach((key) => {
            event[key] = req.body[key];
        });
        await event.save();
        console.log('done');
        res.status(200).json({
            success: true,
            event,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error editing event',
        });
    }
};
exports.deleteEventfortimeline = async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id);
        if (event.createdBy.toString() !== req.user._id.toString()) {
            throw new Error('Unauthorized');
        }
        await event.remove();
        res.status(200).json({
            success: true,
            event,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error deleting event',
        });
    }
};

exports.addtofavourite = async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id);
        if (event.createdBy.toString() !== req.user._id.toString()) {
            throw new Error('Unauthorized');
        }
        if (event.type === 'timeline') {
            throw new Error('You can not add timeline events to favorite');
        }
        //check if event is already added to favorite
        let userdetails = await userModel.findById(req.user._id);
        const isEventAdded = userdetails.impEvents.find(
            (e) => e.toString() === event._id.toString()
        );
        if (isEventAdded) {
            //remove from favorite
            userdetails.impEvents = userdetails.impEvents.filter(
                (e) => e.toString() !== event._id.toString()
            );
            await userdetails.save();
            res.status(200).json({
                success: true,
                userdetails,
            });
            return;
        }
        userdetails.impEvents.push(event._id);
        await userdetails.save();
        res.status(200).json({
            success: true,
            userdetails,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Error adding to favorite',
        });
    }
};

exports.geteventoftimeline = async (req, res) => {
    const timelineid = req.params.id;
    try {
        const timeline = await TimelineModel.findById(timelineid).populate(
            'events'
        );
        const user = await userModel
            .findById(req.user._id)
            .populate({
                path: 'followedTimelines',
                populate: {
                    path: 'userTimelineSettings.uncheckedChildren',
                },
            })
            .populate({
                path: 'followedTimelines',
                populate: {
                    path: 'userTimelineSettings.uncheckedTags',
                },
            });
        // console.log(user);
        // console.log(user.followedTimelines);
        const filteredTimeline = user.followedTimelines.filter(
            (item) => item?.timelineRef?.toString() === timelineid?.toString()
        );
        // console.log(filteredTimeline);
        const events = [];
        for (let i = 0; i < timeline.events.length; i++) {
            const event = await EventModel.findById(timeline.events[i]);
            if (
                !user.followedTimelines?.userTimelineSettings?.uncheckedTags?.includes(
                    event?.tags[0]
                )
            ) {
                events.push({ event: event, eventTag: event?.tags[0] });
            }
        }
        const timelineList = [];
        async function traverseFriends(timelineId, timelineChildName) {
            const timeline = await TimelineModel.findById(timelineId).populate(
                'followedTimeline'
            );
            if (!timeline) {
                return;
            }

            for (const friend of timeline.followedTimeline) {
                if (!timelineList.includes(friend.timelineId)) {
                    timelineList.push(friend.timelineId);
                    const timelineindividual = await TimelineModel.findById(
                        friend.timelineId
                    );
                    for (let i = 0; i < timelineindividual.events.length; i++) {
                        const event = await EventModel.findById(
                            timelineindividual.events[i]
                        );
                        events.push({
                            event: event,
                            eventTag: timelineChildName,
                        });
                    }

                    await traverseFriends(friend.timelineId, timelineChildName);
                }
            }
        }
        for (let i = 0; i < timeline.followedTimeline.length; i++) {
            const timelinechild = await TimelineModel.findById(
                timeline.followedTimeline[i].timelineId
            );
            if (
                !filteredTimeline.userTimelineSettings?.uncheckedChildren?.includes(
                    timelinechild._id
                )
            ) {
                //find all events of timelinechild
                console.log(timelinechild);
                for (let i = 0; i < timelinechild.events.length; i++) {
                    const event = await EventModel.findById(
                        timelinechild.events[i]
                    );
                    events.push({
                        event: event,
                        eventTag: timelinechild.name,
                    });
                }

                traverseFriends(timelinechild._id, timelinechild.name);
            }
        }
        console.log(timelineList);
        res.status(200).json({
            success: true,
            events,
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: 'Error getting events',
        });
    }
};

// exports.geteventoftimeline = async (req, res) => {
//     const id = req.params.id;
//     const timeline = await timelineModel.findById(id);
//     // console.log(timeline);
//     if (!timeline) {
//         throw new Error(`Timeline not found .`);
//     }

//     const friendsBelow = new Set();
//     let depth = 1;
//     async function traverseFriends(userId, depth) {
//         if (depth == 3) return;
//         const timeline = await timelineModel
//             .findById(id)
//             .populate('followedTimeline');
//         // console.log(timeline);
//         if (!timeline) {
//             return;
//         }

//         for (const friend of timeline.followedTimeline) {
//             // console.log(friend.timelineRef, friend);
//             if (true) {
//                 friendsBelow.add(friend.timelineId);
//                 await traverseFriends(friend.timelineId, depth + 1);
//             }
//         }
//     }

//     await traverseFriends(timeline._id, depth);

//     res.json(friendsBelow);
// };
