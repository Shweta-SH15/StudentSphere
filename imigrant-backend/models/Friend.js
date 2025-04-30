const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who created this friend profile
    nationality: String,
    interests: [String],
    languages: [String],
    profileImage: String, // Optional profile image
}, { timestamps: true });

module.exports = mongoose.model('Friend', FriendSchema);
