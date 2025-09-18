// middleware/authMiddleware.js
const admin = require('./firebaseAdmin'); // ✅ use initialized admin
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // Load user by Firebase UID
    const user = await User.findById(uid).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Not authorized - user not found" });
    }

    // Attach clean user object
    req.user = {
      uid: user._id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ error: "Not authorized, token invalid" });
  }
};

module.exports = protect;
