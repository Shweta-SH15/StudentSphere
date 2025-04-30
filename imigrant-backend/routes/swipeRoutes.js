const express = require('express');
const { likeFriend, likeRoommate, likeAccommodation, likeRestaurant } = require('../controllers/swipeController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/friend', protect, likeFriend);
router.post('/roommate', protect, likeRoommate);
router.post('/accommodation', protect, likeAccommodation);
router.post('/restaurant', protect, likeRestaurant);

module.exports = router;
