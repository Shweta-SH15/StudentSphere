const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const admin = require('../middleware/firebaseAdmin');  // Firebase Admin SDK
const User = require('../models/User');

// ... (registration route not shown for brevity)

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);  // assume passwords are hashed
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    // User authenticated – create a Firebase custom token for this user
    const uid = user._id.toString();  // use MongoDB _id as Firebase UID
    const customToken = await admin.auth().createCustomToken(uid);
    // Respond with user info and the custom token
    res.json({ user, token: customToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
