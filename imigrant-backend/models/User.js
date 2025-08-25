// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   _id: { type: String, required: true }, // Firebase UID
//   name: String,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
//   email: { type: String, unique: true, required: true },
//   password: String,
//   nationality: String,
//   interest: [String],
//   language: [String],
//   bio: String,
//   avatarConfig: { type: String, default: "" }, // ✅ NEW
//   gender: String,
//   age: Number,
//   lifestyle: [String],
//   propertyType: String,
//   location: String,
//   priceRange: String,
//   cuisinePreference: [String],
//   likedFriends: [{ type: String, ref: 'User' }],
//   likedRoommates: [{ type: String, ref: 'User' }],
//   likedAccommodations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' }],
//   likedRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);

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
  bio: String,
  gender: {
    String,
    enum: ["Male", "Female", "Other"],
    default: "Other"
  },
  age: Number,
  lifestyle: [String],
  propertyType: String,
  location: String,
  priceRange: String,
  cuisinePreference: [String],

  avatarConfig: { type: String, default: "topType=ShortHairShortCurly&eyeType=Happy" },

  likedFriends: [{ type: String, ref: 'User' }],
  likedRoommates: [{ type: String, ref: 'User' }],
  likedAccommodations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' }],
  likedRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
