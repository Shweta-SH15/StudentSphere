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
// const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Like routes (POST)
router.post('/friend',  likeFriend);
router.post('/roommate',  likeRoommate);
router.post('/accommodation',  likeAccommodation);
router.post('/restaurant',  likeRestaurant);

// Get liked items (GET)
router.get('/friends', getLikedFriends);
router.get('/roommates',  getLikedRoommates);
router.get('/accommodations',  getLikedAccommodations);
router.get('/restaurants',  getLikedRestaurants);

module.exports = router;
