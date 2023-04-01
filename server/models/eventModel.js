const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Event name is required'],
        },
        description: {
            type: String,
        },
        startTimestamp: {
            type: Date,
            required: [true, 'Event start time is required'],
        },
        endTimestamp: {
            type: Date,
            required: [true, 'Event end time is required'],
        },
        tags: {
            type: [String],
        },
        allowThread: {
            type: Boolean,
        },
        allowVoiceRooms: {
            type: Boolean,
        },
        threads: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
        },
        type: {
            type: String,
            enum: ['personal', 'timeline'],
        },
        summary: {
            type: String,
        },
        location: {
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Event', eventSchema);
