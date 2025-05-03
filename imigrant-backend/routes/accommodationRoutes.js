const express = require("express");
const router = express.Router();
const { getAccommodations } = require("../controllers/accommodationController");

router.get("/", getAccommodations);

module.exports = router;