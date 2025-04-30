const mongoose = require('mongoose');

const AccommodationSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    propertyType: String,
    location: String,
    priceRange: String,
    description: String,
    images: [String]
}, { timestamps: true });

module.exports = mongoose.model('Accommodation', AccommodationSchema);
