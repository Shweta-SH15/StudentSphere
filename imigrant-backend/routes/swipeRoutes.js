const express = require('express');
const {
  likeFriend,
  likeRoommate,
  likeAccommodation,
  likeRestaurant,
  getLikedFriends,
  getLikedRoommates,
  getLikedAccommodations,
  getLikedRestaurants
} = require('../controllers/swipeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Like routes (POST)
router.post('/friend', protect, likeFriend);
router.post('/roommate', protect, likeRoommate);
router.post('/accommodation', protect, likeAccommodation);
router.post('/restaurant', protect, likeRestaurant);

// Get liked items (GET)
router.get('/friends', protect, getLikedFriends);
router.get('/roommates', protect, getLikedRoommates);
router.get('/accommodations', protect, getLikedAccommodations);
router.get('/restaurants', protect, getLikedRestaurants);

module.exports = router;
