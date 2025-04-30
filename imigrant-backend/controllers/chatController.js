const Chat = require('../models/Chat');

exports.sendMessage = async (req, res) => {
    const { receiverId, message } = req.body;
    const newMessage = await Chat.create({
        sender: req.user.id,
        receiver: receiverId,
        message
    });
    res.json(newMessage);
};

exports.getMessages = async (req, res) => {
    const { withUserId } = req.query;
    const messages = await Chat.find({
        $or: [
            { sender: req.user.id, receiver: withUserId },
            { sender: withUserId, receiver: req.user.id }
        ]
    }).sort('timestamp');
    res.json(messages);
};
