const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Message content is required'],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        photoUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const threadSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Thread title is required'],
        },
        messages: [messageSchema],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        },
        photoUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Thread', threadSchema);
