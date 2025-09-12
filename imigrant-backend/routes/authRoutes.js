const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// All profile routes require a valid Firebase token
router.use(verifyFirebaseToken);

// ✅ Get or Create the logged-in user's profile
router.get("/", async (req, res) => {
  try {
    const uid = req.user.uid;
    let user = await User.findById(uid).select("-password");
    
    // Auto-create user if not found
    if (!user) {
      user = await User.create({
        _id: uid,
        email: req.user.email || "unknown@example.com",
        name: req.user.displayName || "Anonymous"
      });
      console.log(`🆕 New user created: ${uid}`);
    }
    
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch or create profile" });
  }
});

// ✅ Update the logged-in user's profile
router.put("/", async (req, res) => {
  try {
    const uid = req.user.uid;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      uid,
      { $set: updates },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ✅ Liked friends, roommates, accommodations, and restaurants
const {
  getLikedFriends,
  getLikedRoommates,
  getLikedAccommodations,
  getLikedRestaurants,
  getFriendSuggestions,
  getRoommateSuggestions
} = require("../controllers/profileController");

router.get("/friends", getLikedFriends);
router.get("/roommates", getLikedRoommates);
router.get("/accommodations", getLikedAccommodations);
router.get("/restaurants", getLikedRestaurants);
router.get("/friend-suggestions", getFriendSuggestions);
router.get("/roommate-suggestions", getRoommateSuggestions);

module.exports = router;
