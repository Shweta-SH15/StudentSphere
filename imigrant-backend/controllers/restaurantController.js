const Restaurant = require("../models/Restaurant");

const getRestaurants = async (req, res) => {
  try {
    const data = await Restaurant.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to load restaurants" });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    const formatted = restaurants.map((r) => ({
      _id: r._id,
      name: r.name,
      image: r.menuImages?.[0] || '', // Provide first image or blank
      cuisine: r.cuisineType.join(', '),
      address: r.address || '',
      phone: r.phone || '',
      priceRange: r.priceRange,
      rating: r.rating
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

module.exports = { getRestaurants };