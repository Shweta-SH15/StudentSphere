const Restaurant = require("../models/Restaurant");

const getRestaurants = async (req, res) => {
  try {
    const data = await Restaurant.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to load restaurants" });
  }
};

module.exports = { getRestaurants };