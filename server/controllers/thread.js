const ThreadModel = require('../models/threadModel');

exports.joinThread = async (req, res) => {
    const { threadId } = req.body;
    try {
        const thread = await ThreadModel.findById(threadId);
        res.status(200).json({
            success: true,
            result: thread,
            message: 'User added to thread',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
        console.log(error);
    }
};

exports.sendMessage = async (req, res) => {
    const { threadId, message } = req.body;
    try {
        const thread = await ThreadModel.findByIdAndUpdate(
            threadId,
            { $push: { messages: message } },
            { new: true }
        );
        res.status(200).json({
            success: true,
            result: thread,
            message: 'Message sent',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
        console.log(error);
    }
};
