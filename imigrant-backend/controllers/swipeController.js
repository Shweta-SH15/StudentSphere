const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const Restaurant = require('../models/Restaurant');

exports.likeFriend = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.likedFriends.push(req.body.friendId);
        await user.save();
        res.json({ message: 'Friend liked' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to like friend' });
    }
};

exports.likeRoommate = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.likedRoommates.push(req.body.roommateId);
        await user.save();
        res.json({ message: 'Roommate liked' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to like roommate' });
    }
};

exports.likeAccommodation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.likedAccommodations.push(req.body.accommodationId);
        await user.save();
        res.json({ message: 'Accommodation liked' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to like accommodation' });
    }
};

exports.likeRestaurant = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.likedRestaurants.push(req.body.restaurantId);
        await user.save();
        res.json({ message: 'Restaurant liked' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to like restaurant' });
    }
};
