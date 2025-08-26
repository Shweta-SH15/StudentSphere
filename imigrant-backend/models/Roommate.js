const mongoose = require('mongoose');

const RoommateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who created this roommate profile
    gender: String,
    age: Number,
    lifestyle: String,
    location: String,
    budgetRange: String,
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    profileImage: String, // Optional profile image
}, { timestamps: true });

module.exports = mongoose.model('Roommate', RoommateSchema);
 