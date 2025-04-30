const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    nationality: String,
    interest: [String],
    language: [String],
    gender: String,
    age: Number,
    lifestyle: String,
    propertyType: String,
    location: String,
    priceRange: String,
    cuisinePreference: [String],
    likedFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedRoommates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedAccommodations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' }],
    likedRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
