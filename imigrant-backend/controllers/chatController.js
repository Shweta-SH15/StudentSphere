// controllers/chatController.js
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user && req.user.uid ? req.user.uid : null;
    if (!senderId) return res.status(401).json({ error: 'Unauthorized' });
    if (!receiverId || !content) return res.status(400).json({ error: 'Missing receiverId or content' });

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text: content,   // store as `text` (standardized)
    });

    // Return normalized object for frontend convenience
    res.json({
      sender: newMessage.sender,
      receiver: newMessage.receiver,
      text: newMessage.text,
      timestamp: newMessage.timestamp ?? newMessage.createdAt,
      _id: newMessage._id,
    });
  } catch (err) {
    console.error("Failed to send message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const currentUserId = req.user && req.user.uid ? req.user.uid : null;
    const withUserId = req.query.withUserId;

    if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' });
    if (!withUserId) return res.status(400).json({ error: 'Missing withUserId parameter' });

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: withUserId },
        { sender: withUserId, receiver: currentUserId }
      ]
    }).sort({ timestamp: 1, createdAt: 1 });

    const normalized = messages.map(msg => ({
      _id: msg._id,
      sender: msg.sender,
      receiver: msg.receiver,
      text: msg.text,
      timestamp: msg.timestamp ?? msg.createdAt,
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
