// const User = require('../models/User');
// const Accommodation = require('../models/Accommodation');
// const Restaurant = require('../models/Restaurant');

// exports.getLikedFriends = async (req, res) => {
//   const user = await User.findById(req.user.uid).populate('likedFriends');
//   res.json(user.likedFriends);
// };

// exports.getLikedRoommates = async (req, res) => {
//   const user = await User.findById(req.user.uid).populate('likedRoommates');
//   res.json(user.likedRoommates);
// };

// exports.getLikedAccommodations = async (req, res) => {
//   const user = await User.findById(req.user.uid).populate('likedAccommodations');
//   res.json(user.likedAccommodations);
// };

// exports.getLikedRestaurants = async (req, res) => {
//   const user = await User.findById(req.user.uid).populate('likedRestaurants');
//   res.json(user.likedRestaurants);
// };

// exports.getFriendSuggestions = async (req, res) => {
//   const currentUser = await User.findById(req.user.uid);
//   const suggestions = await User.find({
//     _id: { $ne: currentUser._id, $nin: currentUser.likedFriends }
//   }).select("-password");

//   res.json(suggestions);
// };

// exports.getRoommateSuggestions = async (req, res) => {
//   const currentUser = await User.findById(req.user.uid);
//   const suggestions = await User.find({
//     _id: { $ne: currentUser._id, $nin: currentUser.likedRoommates }
//   }).select("-password");

//   res.json(suggestions);
// };

// // ✅ Avatar update only
// exports.updateAvatar = async (req, res) => {
//   try {
//     const userId = req.user.uid;
//     const avatarConfig = req.body.avatarConfig;
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: { avatarConfig } },
//       { new: true }
//     );
//     res.json(updatedUser);
//   } catch (error) {
//     console.error("Update avatar error:", error.message);
//     res.status(500).json({ error: "Failed to update avatar" });
//   }
// };


const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const Restaurant = require('../models/Restaurant');

exports.getLikedFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid).populate('likedFriends');
        res.json(user.likedFriends);
    } catch (error) {
        console.error("Error fetching liked friends:", error.message);
        res.status(500).json({ error: "Failed to get liked friends" });
    }
};

exports.getLikedRoommates = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid).populate('likedRoommates');
        res.json(user.likedRoommates);
    } catch (error) {
        console.error("Error fetching liked roommates:", error.message);
        res.status(500).json({ error: "Failed to get liked roommates" });
    }
};

exports.getLikedAccommodations = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid).populate('likedAccommodations');
        res.json(user.likedAccommodations);
    } catch (error) {
        console.error("Error fetching liked accommodations:", error.message);
        res.status(500).json({ error: "Failed to get liked accommodations" });
    }
};

exports.getLikedRestaurants = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid).populate('likedRestaurants');
        res.json(user.likedRestaurants);
    } catch (error) {
        console.error("Error fetching liked restaurants:", error.message);
        res.status(500).json({ error: "Failed to get liked restaurants" });
    }
};

exports.getFriendSuggestions = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.uid);
        const suggestions = await User.find({
            _id: { $ne: currentUser._id, $nin: currentUser.likedFriends }
        }).select("-password");
        res.json(suggestions);
    } catch (error) {
        console.error("Error fetching friend suggestions:", error.message);
        res.status(500).json({ error: "Failed to get friend suggestions" });
    }
};

exports.getRoommateSuggestions = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.uid);
        const suggestions = await User.find({
            _id: { $ne: currentUser._id, $nin: currentUser.likedRoommates }
        }).select("-password");
        res.json(suggestions);
    } catch (error) {
        console.error("Error fetching roommate suggestions:", error.message);
        res.status(500).json({ error: "Failed to get roommate suggestions" });
    }
};

// ✅ Profile update
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.uid;
        const updateData = {
            name: req.body.name,
            nationality: req.body.nationality,
            language: req.body.language,
            bio: req.body.bio,
            gender: req.body.gender,
            age: req.body.age,
            lifestyle: req.body.lifestyle,
            interest: req.body.interest,
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        console.error("Update profile error:", error.message);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

// ✅ New: Update avatar config only
exports.updateAvatar = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { avatarConfig } = req.body;
        if (!avatarConfig) return res.status(400).json({ error: "Missing avatar config" });

        const user = await User.findByIdAndUpdate(
            uid,
            { $set: { avatarConfig } },
            { new: true }
        );

        res.json({ message: "Avatar updated", user });
    } catch (error) {
        console.error("Avatar update error:", error.message);
        res.status(500).json({ error: "Failed to update avatar" });
    }
};
