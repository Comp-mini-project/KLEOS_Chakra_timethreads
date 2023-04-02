const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Timeline name is required.'],
        },
        description: {
            type: String,
        },
        photoUrl: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        tags: {
            type: [String],
        },
        admin: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
        },
        followedTimeline: [
            {
                name: {
                    type: String,
                },
                timelineId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Timeline',
                },
            },
        ],
        events: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Event',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Timeline', timelineSchema);
