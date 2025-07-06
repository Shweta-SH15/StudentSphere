// // models/User.js

// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     _id: {
//         type: String, // Use Firebase UID as the _id
//         required: true,
//     },
//     name: String,
//     email: { type: String, unique: true, required: true },
//     password: String,
//     nationality: String,
//     interest: [String],
//     language: [String],
//     bio: String,
//     profileImage: String,
//     gender: String,
//     age: Number,
//     lifestyle: [String],
//     propertyType: String,
//     location: String,
//     priceRange: String,
//     cuisinePreference: [String],

    
//     likedFriends: [{ type: String, ref: 'User' }],
//     likedRoommates: [{ type: String, ref: 'User' }],
//     likedAccommodations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' }],
//     likedRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);


const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Firebase UID
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  nationality: String,
  interest: [String],
  language: [String],
  bio: String,
  avatarConfig: { type: String, default: "" }, // ✅ NEW
  gender: String,
  age: Number,
  lifestyle: [String],
  propertyType: String,
  location: String,
  priceRange: String,
  cuisinePreference: [String],
  likedFriends: [{ type: String, ref: 'User' }],
  likedRoommates: [{ type: String, ref: 'User' }],
  likedAccommodations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' }],
  likedRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
