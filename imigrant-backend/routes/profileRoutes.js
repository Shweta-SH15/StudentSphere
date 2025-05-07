const express = require('express');
const { getLikedFriends, getLikedRoommates, getLikedAccommodations, getLikedRestaurants, getFriendSuggestions, getRoommateSuggestions, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/friends', protect, getLikedFriends);
router.get('/roommates', protect, getLikedRoommates);
router.get('/accommodations', protect, getLikedAccommodations);
router.get('/restaurants', protect, getLikedRestaurants);
router.get("/friend-suggestions", protect, getFriendSuggestions);
router.get("/roommate-suggestions", protect, getRoommateSuggestions);

router.put('/', protect, updateProfile)
router.get('/', async (req, res) => {
    try {
      const userId = req.user.uid;  // set by verifyFirebaseToken middleware
      const user = await User.findById(userId).select('-password');  // omit password
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error('Profile fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });
  
  // Update the logged-in user's profile
  router.put('/', async (req, res) => {
    try {
      const userId = req.user.uid;
      const { name, nationality, interest, about } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      // Update only the fields provided in the request
      if (name !== undefined) user.name = name;
      if (nationality !== undefined) user.nationality = nationality;
      if (interest !== undefined) user.interest = interest;  // assuming interest is an array of strings
      if (about !== undefined) user.about = about;
      await user.save();
  
      res.json(user);  // return the updated user document
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });
module.exports = router;
