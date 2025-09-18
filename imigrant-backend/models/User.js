const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {
    type: String, // Firebase UID
    required: true,
  },
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  nationality: String,
  interest: [String],
  language: [String],
  bio: { type: String },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Other"
  },
  age: { type: Number },
  lifestyle: [{ type: String }],
  propertyType: String,
  location: String,
  priceRange: String,
  cuisinePreference: [String],

  avatarConfig: { type: String, default: "topType=ShortHairShortCurly&eyeType=Happy" },

  // ✅ Correct: reference User by ID
  likedFriends: [{ type: String, ref: 'User' }],
  likedRoommates: [{ type: String, ref: 'User' }],

  likedAccommodations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' }],
  likedRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
// models/User.js