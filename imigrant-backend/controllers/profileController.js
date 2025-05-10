// const User = require('../models/User');
// const Accommodation = require('../models/Accommodation');
// const Restaurant = require('../models/Restaurant');

// exports.getLikedFriends = async (req, res) => {
//     const user = await User.findById(req.user.id).populate('likedFriends');
//     res.json(user.likedFriends);
// };

// exports.getLikedRoommates = async (req, res) => {
//     const user = await User.findById(req.user.id).populate('likedRoommates');
//     res.json(user.likedRoommates);
// };

// exports.getLikedAccommodations = async (req, res) => {
//     const user = await User.findById(req.user.id).populate('likedAccommodations');
//     res.json(user.likedAccommodations);
// };

// exports.getLikedRestaurants = async (req, res) => {
//     const user = await User.findById(req.user.id).populate('likedRestaurants');
//     res.json(user.likedRestaurants);
// };
// exports.getFriendSuggestions = async (req, res) => {
//     try {
//         const currentUser = await User.findById(req.user.id);
//         const suggestions = await User.find({
//             _id: { $ne: currentUser._id, $nin: currentUser.likedFriends }
//         }).select("-password");

//         res.json(suggestions);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to get friend suggestions" });
//     }
// };

// exports.getRoommateSuggestions = async (req, res) => {
//     try {
//         const currentUser = await User.findById(req.user.id);
//         const suggestions = await User.find({
//             _id: { $ne: currentUser._id, $nin: currentUser.likedRoommates }
//         }).select("-password");

//         res.json(suggestions);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to get roommate suggestions" });
//     }
// };

// exports.updateProfile = async (req, res) => {
//     try {
//       const userId = req.user.id;
//       const updateData = {
//         name: req.body.name,
//         nationality: req.body.nationality,
//         language: req.body.language,
//         bio: req.body.bio,
//         profileImage: req.body.profileImage,
//         gender: req.body.gender,
//         age: req.body.age,
//         lifestyle: req.body.lifestyle,
//         interest: req.body.interest,
//       };
  
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { $set: updateData },
//         { new: true }
//       );
  
//       res.json(updatedUser);
//     } catch (error) {
//       console.error("Update profile error:", error);
//       res.status(500).json({ error: "Failed to update profile" });
//     }
//   };
  
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

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.uid;
        const updateData = {
            name: req.body.name,
            nationality: req.body.nationality,
            language: req.body.language,
            bio: req.body.bio,
            profileImage: req.body.profileImage,
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
    