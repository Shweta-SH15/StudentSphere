const express = require('express');
const {
  likeFriend,
  likeRoommate,
  likeAccommodation,
  likeRestaurant,
  getLikedFriends,
  getLikedRoommates,
  getLikedAccommodations,
  getLikedRestaurants,
  unlikeFriend,
  unlikeRoommate,
  unlikeAccommodation,
  unlikeRestaurant
} = require('../controllers/swipeController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

const router = express.Router();
router.use(verifyFirebaseToken); // 🔐 Apply middleware to all routes below

router.post('/friend', likeFriend);
router.post('/roommate', likeRoommate);
router.post('/accommodation', likeAccommodation);
router.post('/restaurant', likeRestaurant);

router.get('/friends', getLikedFriends);
router.get('/roommates', getLikedRoommates);
router.get('/accommodations', getLikedAccommodations);
router.get('/restaurants', getLikedRestaurants);

router.post('/unlike-friend', unlikeFriend);
router.post('/unlike-roommate',unlikeRoommate);
router.post('/unlike-accommodation', unlikeAccommodation);
router.post('/unlike-restaurant', unlikeRestaurant);
module.exports = router;
