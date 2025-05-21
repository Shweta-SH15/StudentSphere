// models/Message.js
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  sender: { type: String, ref: 'User' },   // Firebase UID is a String
  receiver: { type: String, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);  // ✅ Still exporting as Chat
