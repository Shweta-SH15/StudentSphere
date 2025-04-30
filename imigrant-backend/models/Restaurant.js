const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: String,
    location: String,
    priceRange: String,
    cuisineType: [String],
    rating: Number,
    description: String,
    menuImages: [String]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
