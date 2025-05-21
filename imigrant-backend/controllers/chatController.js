const Chat = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const newMessage = await Chat.create({
      sender: req.user.uid,     // using Firebase UID
      receiver: receiverId,
      message: content,
    });
    res.json({
      ...newMessage.toObject(),
      content: newMessage.message, // normalize for frontend
    });
  } catch (err) {
    console.error("Failed to send message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.uid;
    const withUserId = req.query.withUserId;

    if (!withUserId) {
      return res.status(400).json({ error: 'Missing withUserId parameter' });
    }

    const messages = await Chat.find({
      $or: [
        { sender: currentUserId, receiver: withUserId },
        { sender: withUserId, receiver: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    const normalized = messages.map(msg => ({
      sender: msg.sender,
      receiver: msg.receiver,
      content: msg.message,      // frontend expects this
      timestamp: msg.timestamp,
    }));

    res.json(normalized); // ✅ Always send an array
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
