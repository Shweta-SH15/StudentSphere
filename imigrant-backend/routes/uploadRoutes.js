// routes/uploadRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const User = require("../models/User");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// Profile picture upload route (authenticated via verifyFirebaseToken)
router.post("/profile", verifyFirebaseToken, upload.single("image"), async (req, res) => {
    try {
        const userId = req.user.uid;
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        // Construct the file URL or path (served from /uploads)
        const imageUrl = `/uploads/${req.file.filename}`;

        // Use the Firebase UID to find the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Update user's profileImage path in DB
        user.profileImage = imageUrl;
        await user.save();

        // Respond with the image URL so frontend can update state
        res.json({ imageUrl });
    } catch (err) {
        console.error("Image upload error:", err);
        res.status(500).json({ error: "Upload failed" });
    }
});

module.exports = router;
