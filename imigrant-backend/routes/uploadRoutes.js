const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Upload profile picture
router.post('/profile', protect, upload.single('image'), (req, res) => {
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Upload property images
router.post('/accommodation', protect, upload.array('images', 5), (req, res) => {
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ imageUrls });
});

// Upload restaurant menu images
router.post('/restaurant', protect, upload.array('menuImages', 5), (req, res) => {
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ imageUrls });
});

module.exports = router;
