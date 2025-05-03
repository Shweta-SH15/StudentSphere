const Accommodation = require("../models/Accommodation");

const getAccommodations = async (req, res) => {
  try {
    const data = await Accommodation.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to load accommodations" });
  }
};

module.exports = { getAccommodations };