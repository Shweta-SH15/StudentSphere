// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const profileController = require("../controllers/profileController");

// Protect all profile routes
router.use(verifyFirebaseToken);

// Get profile (existing behavior)
router.get("/", async (req, res) => {
  try {
    const uid = req.user.uid;
    let user = await User.findById(uid).select("-password");

    if (!user) {
      user = await User.create({
        _id: uid,
        email: req.user.email,
        name: req.user.displayName || "New User",
        avatarConfig: "topType=ShortHairShortCurly&eyeType=Happy"
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch or create profile" });
  }
});

// Update profile (existing behavior)
router.put("/", async (req, res) => {
  try {
    const uid = req.user.uid;
    const updates = req.body;

    const user = await User.findOneAndUpdate(
      { _id: uid },
      {
        $set: updates,
        $setOnInsert: { _id: uid, email: req.user.email || "unknown@example.com" }
      },
      { new: true, upsert: true, runValidators: true, context: "query" }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    const msg = err.code === 11000 ? "Email already in use" : "Failed to update profile";
    res.status(500).json({ error: msg });
  }
});

// Avatar endpoints (existing behavior)
router.get("/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    res.json({ avatarConfig: user.avatarConfig });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

router.put("/avatar", async (req, res) => {
  try {
    const { avatarConfig } = req.body;
    if (!avatarConfig) return res.status(400).json({ error: "Missing avatarConfig" });

    const updated = await User.findByIdAndUpdate(
      req.user.uid,
      { $set: { avatarConfig } },
      { new: true }
    );

    res.json({ message: "Avatar updated", avatarConfig: updated.avatarConfig });
  } catch (err) {
    res.status(500).json({ error: "Failed to update avatar" });
  }
});

// -------------------------
// New / missing endpoints
// -------------------------

// Liked items (populated by mongoose in controller)
router.get("/friends", profileController.getLikedFriends);
router.get("/roommates", profileController.getLikedRoommates);
router.get("/accommodations", profileController.getLikedAccommodations);
router.get("/restaurants", profileController.getLikedRestaurants);

// Suggestions
router.get("/friend-suggestions", profileController.getFriendSuggestions);
router.get("/roommate-suggestions", profileController.getRoommateSuggestions);

module.exports = router;
