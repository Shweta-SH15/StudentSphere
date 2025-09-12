const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

router.use(verifyFirebaseToken);

// Get profile
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

// Update profile
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

// ✅ GET avatar config
router.get("/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    res.json({ avatarConfig: user.avatarConfig });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

// ✅ PUT update avatar config
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

module.exports = router;
