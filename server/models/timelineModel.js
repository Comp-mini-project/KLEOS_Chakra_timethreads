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
            type: String,
        },
        tags: {
            type: [String],
        },
        admin: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
        },
        followedTimeline: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Timeline',
        },
        uncheckedTags: {
            type: [String],
        },
        uncheckedChildren: {
            type: [mongoose.Schema.Types.ObjectId],
        },
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
