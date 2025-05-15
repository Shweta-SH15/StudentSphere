const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const Restaurant = require('../models/Restaurant');

// Like Friend
exports.likeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    await User.findByIdAndUpdate(
      req.user.uid,
      { $addToSet: { likedFriends: friendId } },
      { new: true }
    );
    res.json({ message: 'Friend liked!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like friend' });
  }
};

exports.unlikeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    await User.findByIdAndUpdate(
      req.user.uid,
      { $pull: { likedFriends: friendId } },
      { new: true }
    );
    res.json({ message: 'Friend unliked!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unlike friend' });
  }
};

exports.likeRoommate = async (req, res) => {
  try {
    const { roommateId } = req.body;
    await User.findByIdAndUpdate(
      req.user.uid,
      { $addToSet: { likedRoommates: roommateId } },
      { new: true }
    );
    res.json({ message: 'Roommate liked!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like roommate' });
  }
};

exports.likeAccommodation = async (req, res) => {
  try {
    const { accommodationId } = req.body;
    await User.findByIdAndUpdate(
      req.user.uid,
      { $addToSet: { likedAccommodations: accommodationId } },
      { new: true }
    );
    res.json({ message: 'Accommodation liked!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like accommodation' });
  }
};

exports.likeRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.body;
    await User.findByIdAndUpdate(
      req.user.uid,
      { $addToSet: { likedRestaurants: restaurantId } },
      { new: true }
    );
    res.json({ message: 'Restaurant liked!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like restaurant' });
  }
};

// GET Favorites (used on FavoritesPage)
exports.getLikedFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid).populate('likedFriends');
    res.json(user?.likedFriends || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch liked friends' });
  }
};

exports.getLikedRoommates = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid).populate('likedRoommates');
    res.json(user?.likedRoommates || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch liked roommates' });
  }
};

exports.getLikedAccommodations = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid).populate('likedAccommodations');
    res.json(user?.likedAccommodations || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch liked accommodations' });
  }
};

exports.getLikedRestaurants = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid).populate('likedRestaurants');
    res.json(user?.likedRestaurants || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch liked restaurants' });
  }
};
