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
exports.getFriendSuggestions = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const suggestions = await User.find({
            _id: { $ne: currentUser._id, $nin: currentUser.likedFriends }
        }).select("-password");

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: "Failed to get friend suggestions" });
    }
};

exports.getRoommateSuggestions = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const suggestions = await User.find({
            _id: { $ne: currentUser._id, $nin: currentUser.likedRoommates }
        }).select("-password");

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: "Failed to get roommate suggestions" });
    }
};
