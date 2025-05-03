const express = require('express');
const { getLikedFriends, getLikedRoommates, getLikedAccommodations, getLikedRestaurants, getFriendSuggestions, getRoommateSuggestions } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/friends', protect, getLikedFriends);
router.get('/roommates', protect, getLikedRoommates);
router.get('/accommodations', protect, getLikedAccommodations);
router.get('/restaurants', protect, getLikedRestaurants);
router.get("/friend-suggestions", protect, getFriendSuggestions);
router.get("/roommate-suggestions", protect, getRoommateSuggestions);

module.exports = router;
