const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const Restaurant = require('../models/Restaurant');

exports.getLikedFriends = async (req, res) => {
    const user = await User.findById(req.user.id).populate('likedFriends');
    res.json(user.likedFriends);
};

exports.getLikedRoommates = async (req, res) => {
    const user = await User.findById(req.user.id).populate('likedRoommates');
    res.json(user.likedRoommates);
};

exports.getLikedAccommodations = async (req, res) => {
    const user = await User.findById(req.user.id).populate('likedAccommodations');
    res.json(user.likedAccommodations);
};

exports.getLikedRestaurants = async (req, res) => {
    const user = await User.findById(req.user.id).populate('likedRestaurants');
    res.json(user.likedRestaurants);
};
