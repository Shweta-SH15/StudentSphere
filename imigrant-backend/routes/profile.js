const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/firebaseAuth");
const User = require("../models/User"); // assuming Mongoose

// GET profile
router.get("/", verifyFirebaseToken, async (req, res) => {
  const user = await User.findOne({ email: req.user.email }); // or uid if stored
  res.json(user);
});

// PUT update profile
router.put('/', verifyFirebaseToken, async (req, res) => {
    try {
      const updates = req.body; // contains fields like gender, age, etc.
      const userId = req.user.uid;
  
      const updated = await User.findOneAndUpdate({ firebaseUid: userId }, updates, { new: true });
      if (!updated) return res.status(404).json({ error: 'User not found' });
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  });
  

module.exports = router;
