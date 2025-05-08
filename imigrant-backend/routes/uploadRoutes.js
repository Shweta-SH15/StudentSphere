const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const User = require("../models/User");

// Configure Multer to store files in ./uploads and preserve file extensions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // ensure this folder exists next to server.js
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // e.g. profile-<uid>-1633036800000.jpg
    const filename = `profile-${req.user.uid}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// Profile picture upload route (authenticated via verifyFirebaseToken)
router.post(
  "/profile",
  verifyFirebaseToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.uid;
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Construct the file URL (served from /uploads)
      const imageUrl = `/uploads/${req.file.filename}`;

      // Persist to MongoDB
      await User.findByIdAndUpdate(
        userId,
        { profileImage: imageUrl },
        { new: true, runValidators: true }
      );

      // Respond with the new image URL
      res.json({ imageUrl });
    } catch (err) {
      console.error("Image upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

module.exports = router;
