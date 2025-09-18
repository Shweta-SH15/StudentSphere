const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const Restaurant = require('../models/Restaurant');

// ---------------------
// Liked Items
// ---------------------
exports.getLikedFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid)
      .populate('likedFriends', '-password');

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.likedFriends);
  } catch (error) {
    console.error("Error fetching liked friends:", error.message);
    res.status(500).json({ error: "Failed to get liked friends" });
  }
};

exports.getLikedRoommates = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid)
      .populate('likedRoommates', '-password');

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.likedRoommates);
  } catch (error) {
    console.error("Error fetching liked roommates:", error.message);
    res.status(500).json({ error: "Failed to get liked roommates" });
  }
};

exports.getLikedAccommodations = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid)
      .populate('likedAccommodations');

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.likedAccommodations);
  } catch (error) {
    console.error("Error fetching liked accommodations:", error.message);
    res.status(500).json({ error: "Failed to get liked accommodations" });
  }
};

exports.getLikedRestaurants = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid)
      .populate('likedRestaurants');

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.likedRestaurants);
  } catch (error) {
    console.error("Error fetching liked restaurants:", error.message);
    res.status(500).json({ error: "Failed to get liked restaurants" });
  }
};

// ---------------------
// Suggestions
// ---------------------
exports.getFriendSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.uid);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    const suggestions = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } },
        { _id: { $nin: currentUser.likedFriends } }
      ]
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
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    const suggestions = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } },
        { _id: { $nin: currentUser.likedRoommates } }
      ]
    }).select("-password");

    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching roommate suggestions:", error.message);
    res.status(500).json({ error: "Failed to get roommate suggestions" });
  }
};

// ---------------------
// Profile Update
// ---------------------
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid;

    // only update provided fields
    const updateData = {};
    [
      "name",
      "nationality",
      "language",
      "bio",
      "gender",
      "age",
      "lifestyle",
      "interest"
    ].forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// ---------------------
// Avatar Update
// ---------------------
exports.updateAvatar = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { avatarConfig } = req.body;

    if (!avatarConfig) {
      return res.status(400).json({ error: "Missing avatar config" });
    }

    const user = await User.findByIdAndUpdate(
      uid,
      { $set: { avatarConfig } },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Avatar updated", avatarConfig: user.avatarConfig });
  } catch (error) {
    console.error("Avatar update error:", error.message);
    res.status(500).json({ error: "Failed to update avatar" });
  }
};
