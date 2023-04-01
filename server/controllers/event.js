const mongoose = require('mongoose');
const EventModel = require('../models/eventModel');
const TimelineModel = require('../models/timelineModel');
exports.createmyEvent = async (req, res) => {
    try {
        const event = await EventModel.create({
            ...req.body,
            createdBy: req.user._id,
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
        const event = await EventModel.create({
            ...req.body,
            createdBy: req.user._id,
            type: 'timeline',
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
