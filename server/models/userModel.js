const mongoose = require('mongoose');
const Event = require('./eventModel.js');
const userSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
        },
        displayName: {
            type: String,
            required: [true, 'User name is required.'],
        },
        photoUrl: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        },
        impEvents: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Event',
        },
        followedTimelines: [
            {
                timelineRef: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Timeline',
                },
                userTimelineSettings: {
                    uncheckedTags: {
                        type: [String],
                    },
                    uncheckedChildren: {
                        type: [mongoose.Schema.Types.ObjectId],
                    },
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
