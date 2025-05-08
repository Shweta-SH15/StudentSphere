// routes/uploadRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Profile picture upload route (authenticated via verifyFirebaseToken)
router.post("/profile", verifyFirebaseToken, upload.single("image"), async (req, res) => {
    try {
        const userId = req.user.uid;
        if (!req.file) return res.status(400).json({ error: "No image file provided" });

        // Construct the file URL or path (served from /uploads)
        const imageUrl = `/uploads/${req.file.filename}`;
        
        // Respond with the image URL so frontend can update state
        res.json({ imageUrl });
    } catch (err) {
        console.error("Image upload error:", err);
        res.status(500).json({ error: "Upload failed" });
    }
});

module.exports = router;
